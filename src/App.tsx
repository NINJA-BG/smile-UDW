/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { UnderwritingCase, QueueStatus, InsuranceType, CoverageTerm } from './types';
import { INITIAL_CASES } from './data/mockData';
import { Sidebar } from './components/Sidebar';
import { TopNavbar } from './components/TopNavbar';
import { HeroWelcomeBanner } from './components/HeroWelcomeBanner';
import { StatusCardsRow } from './components/StatusCardsRow';
import { AnalyticsAndActivityRow } from './components/AnalyticsAndActivityRow';
import { QuickActionsAndTopAgents } from './components/QuickActionsAndTopAgents';
import { PendingActionsRow } from './components/PendingActionsRow';
import { FilterBar } from './components/FilterBar';
import { QueueTable } from './components/QueueTable';
import { SmileUnderwriteQueueSection } from './components/SmileUnderwriteQueueSection';
import { CaseDetailModal } from './components/CaseDetailModal';
import { NewCaseModal } from './components/NewCaseModal';
import { UnderwritingInspectionDetailView } from './components/UnderwritingInspectionDetailView';
import { CheckCircle2, Info, Flame, Layers, FileSpreadsheet, LayoutDashboard } from 'lucide-react';
import {
  initializeFirestoreData,
  subscribeToCases,
  saveCaseToFirestore,
  createCaseInFirestore,
  resetDatabaseToInitial
} from './services/firestoreService';

export default function App() {
  // Application Data State (defaults to INITIAL_CASES, syncs with Firestore)
  const [cases, setCases] = useState<UnderwritingCase[]>(() => {
    const saved = localStorage.getItem('smile_underwrite_cases');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.some(c => c.id === 'case-screen-1')) {
          // Merge customerChangeRequest from INITIAL_CASES if cached item lacks it
          return parsed.map(c => {
            const init = INITIAL_CASES.find(i => i.id === c.id);
            if (init?.customerChangeRequest && !c.customerChangeRequest) {
              return { ...c, customerChangeRequest: init.customerChangeRequest };
            }
            return c;
          });
        }
      } catch (e) {
        console.error('Failed to parse saved cases', e);
      }
    }
    return INITIAL_CASES;
  });

  // Firestore Sync Status
  const [firebaseStatus, setFirebaseStatus] = useState<'synced' | 'syncing' | 'error'>('syncing');

  // Inspection View State (opened when clicking the pencil button or inspect action)
  const [inspectingCase, setInspectingCase] = useState<UnderwritingCase | null>(null);

  // Main View Mode ('queue_table' = SmileUnderwrite view from screenshot, 'dashboard' = Executive Dashboard)
  const [viewMode, setViewMode] = useState<'queue_table' | 'dashboard'>('queue_table');
  const [modalInitialTab, setModalInitialTab] = useState<'info' | 'medical' | 'documents' | 'history'>('info');

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInsuranceType, setSelectedInsuranceType] = useState('ทั้งหมด');
  const [selectedCoverageTerm, setSelectedCoverageTerm] = useState('ทั้งหมด');
  const [selectedStatus, setSelectedStatus] = useState<string>('ทั้งหมด');
  const [filterUrgentOnly, setFilterUrgentOnly] = useState(false);

  // Sidebar & Navigation States
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Modal States
  const [selectedCase, setSelectedCase] = useState<UnderwritingCase | null>(null);
  const [isNewCaseModalOpen, setIsNewCaseModalOpen] = useState(false);
  const [isRealtimeActive, setIsRealtimeActive] = useState(true);
  const [toastMessage, setToastMessage] = useState<{ title: string; message: string; type: 'info' | 'success' | 'urgent' } | null>(null);

  // 1. Initialize Firestore & Subscribe to Real-time Updates
  useEffect(() => {
    let unsubscribe: (() => void) | null = null;
    let isMounted = true;

    async function setupFirebase() {
      setFirebaseStatus('syncing');
      try {
        // Seed if empty or retrieve current collection
        const initialData = await initializeFirestoreData();
        if (isMounted && initialData && initialData.length > 0) {
          setCases(initialData);
          localStorage.setItem('smile_underwrite_cases', JSON.stringify(initialData));
        }

        // Real-time listener for live synchronization
        unsubscribe = subscribeToCases(
          (updatedList) => {
            if (isMounted && updatedList.length > 0) {
              setCases(updatedList);
              localStorage.setItem('smile_underwrite_cases', JSON.stringify(updatedList));
              setFirebaseStatus('synced');
            }
          },
          (err) => {
            console.error('Firestore listener error:', err);
            if (isMounted) setFirebaseStatus('error');
          }
        );

        if (isMounted) setFirebaseStatus('synced');
      } catch (err) {
        console.error('Failed to setup Firebase Firestore:', err);
        if (isMounted) setFirebaseStatus('error');
      }
    }

    setupFirebase();

    return () => {
      isMounted = false;
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Save to LocalStorage fallback whenever cases change
  useEffect(() => {
    localStorage.setItem('smile_underwrite_cases', JSON.stringify(cases));
  }, [cases]);

  // Real-time Simulation Engine (Adds realistic incoming cases to Firestore & State)
  useEffect(() => {
    if (!isRealtimeActive) return;

    const interval = setInterval(() => {
      const randomAction = Math.random();
      if (randomAction < 0.25) {
        // Create an incoming case
        const newRefNo = `UW-2568-${Math.floor(10000 + Math.random() * 90000)}`;
        const sampleTypes: InsuranceType[] = [
          'ประกันสุขภาพ (Health)',
          'ประกันชีวิต (Life)',
          'ประกันโรคร้ายแรง (CI)',
          'ประกันอุบัติเหตุ (PA)',
          'ประกันออมทรัพย์/บำนาญ (Endowment)'
        ];
        const sampleNames = [
          'คุณชยานันท์ ศรีสุข',
          'คุณธนภัทร เจริญศิลป์',
          'คุณกมลวรรณ ทรัพย์เจริญ',
          'คุณอภิสิทธิ์ ชัยชนะ',
          'คุณณัฐพร วงศ์สุวรรณ'
        ];
        const sampleAgents = [
          { name: 'กนกพร พิทักษ์ธรรม', code: 'AG-90442' },
          { name: 'สมเกียรติ ยิ่งยืนยง', code: 'AG-88210' },
          { name: 'วนิดา แสงทอง', code: 'AG-91204' }
        ];

        const randomType = sampleTypes[Math.floor(Math.random() * sampleTypes.length)];
        const randomName = sampleNames[Math.floor(Math.random() * sampleNames.length)];
        const randomAgent = sampleAgents[Math.floor(Math.random() * sampleAgents.length)];
        const sumVal = Math.floor(300000 + Math.random() * 2000000);
        const premiumVal = Math.round(sumVal * 0.035);

        const newSimulatedCase: UnderwritingCase = {
          id: `case-${Date.now()}`,
          refNo: newRefNo,
          insuredName: randomName,
          payerName: randomName,
          agentName: randomAgent.name,
          agentCode: randomAgent.code,
          policyNo: `POL-68-${Math.floor(100000 + Math.random() * 900000)}`,
          dueDate: '2026-09-20',
          status: 'เข้ามาใหม่',
          sumAssured: sumVal,
          premium: premiumVal,
          insuranceType: randomType,
          coverageTerm: 'รายปี (Annual)',
          riskLevel: 'ต่ำ (Standard)',
          insuredAge: 35,
          insuredGender: 'ชาย',
          insuredOccupation: 'พนักงานบริษัทเอกชน',
          insuredIdCard: '1-1002-00345-67-8',
          payerRelation: 'ตนเอง',
          agentBranch: 'สาขาสำนักงานใหญ่',
          agentPhone: '089-123-4567',
          submittedDate: '2026-09-18',
          documents: [],
          isUrgent: Math.random() > 0.7,
          history: [
            {
              id: `log-${Date.now()}`,
              timestamp: `2026-09-18 ${new Date().toLocaleTimeString('th-TH')}`,
              actor: `${randomAgent.name} (${randomAgent.code})`,
              role: 'ตัวแทนประกัน',
              action: 'สร้างคำขออนุมัติใหม่ผ่านระบบตัวแทน',
              note: 'ส่งเอกสารข้อเสนอและใบคำขอครบถ้วน',
            }
          ]
        };

        // Save to Firestore asynchronously
        createCaseInFirestore(newSimulatedCase).catch(e => console.warn('Simulation Firestore write:', e));

        setCases(prev => [newSimulatedCase, ...prev]);

        showToast(
          'มีงานใหม่เข้ามาในระบบ',
          `คำขอ ${newSimulatedCase.refNo} (${newSimulatedCase.insuredName}) บันทึกสู่ Firebase สำเร็จ`,
          newSimulatedCase.isUrgent ? 'urgent' : 'info'
        );
      }
    }, 35000);

    return () => clearInterval(interval);
  }, [isRealtimeActive]);

  const showToast = (title: string, message: string, type: 'info' | 'success' | 'urgent' = 'info') => {
    setToastMessage({ title, message, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Actions
  const handleUpdateStatus = async (caseId: string, newStatus: QueueStatus, note?: string) => {
    const targetCase = cases.find(c => c.id === caseId);
    if (!targetCase) return;

    const nowStr = new Date().toLocaleTimeString('th-TH');
    const newHistory = [...targetCase.history];
    
    if (note) {
      newHistory.unshift({
        id: `log-${Date.now()}`,
        timestamp: `2026-09-18 ${nowStr}`,
        actor: 'ภานุวัฒน์ สินเจริญ (UW-02)',
        role: 'ผู้พิจารณา',
        action: `เปลี่ยนสถานะเป็น: ${newStatus}`,
        note: note,
      });
    }

    const updated: UnderwritingCase = {
      ...targetCase,
      status: newStatus,
      history: newHistory,
    };

    // Update state immediately for instant responsiveness
    setCases((prev) => prev.map((item) => (item.id === caseId ? updated : item)));

    if (selectedCase && selectedCase.id === caseId) {
      setSelectedCase(updated);
    }

    // Persist to Firebase Firestore
    try {
      setFirebaseStatus('syncing');
      await saveCaseToFirestore(updated);
      setFirebaseStatus('synced');
    } catch (e) {
      console.error('Failed to sync status change to Firebase:', e);
      setFirebaseStatus('error');
    }

    showToast(
      'อัปเดตสถานะงานสำเร็จ',
      `ปรับสถานะเป็น "${newStatus}" และบันทึกสู่ Firebase smileUDW แล้ว`,
      'success'
    );
  };

  const handleAddNote = async (caseId: string, noteText: string) => {
    const targetCase = cases.find(c => c.id === caseId);
    if (!targetCase) return;

    const nowStr = new Date().toLocaleTimeString('th-TH');
    const newHistory = [
      {
        id: `log-${Date.now()}`,
        timestamp: `2026-09-18 ${nowStr}`,
        actor: 'ภานุวัฒน์ สินเจริญ (UW-02)',
        role: 'ผู้พิจารณา',
        action: 'บันทึกความเห็นเพิ่มเติม',
        note: noteText,
      },
      ...targetCase.history,
    ];

    const updated: UnderwritingCase = {
      ...targetCase,
      history: newHistory,
    };

    setCases((prev) => prev.map((item) => (item.id === caseId ? updated : item)));

    if (selectedCase && selectedCase.id === caseId) {
      setSelectedCase(updated);
    }

    try {
      setFirebaseStatus('syncing');
      await saveCaseToFirestore(updated);
      setFirebaseStatus('synced');
    } catch (e) {
      console.error('Failed to sync note to Firebase:', e);
      setFirebaseStatus('error');
    }

    showToast('บันทึกข้อความสำเร็จ', 'บันทึกความเห็นเข้าสู่ Firebase สำเร็จ', 'info');
  };

  const handleCreateNewCase = async (newCaseData: Omit<UnderwritingCase, 'id'>) => {
    const createdCase: UnderwritingCase = {
      ...newCaseData,
      id: `case-${Date.now()}`,
    };

    setCases(prev => [createdCase, ...prev]);

    try {
      setFirebaseStatus('syncing');
      await createCaseInFirestore(createdCase);
      setFirebaseStatus('synced');
    } catch (e) {
      console.error('Failed to create case in Firebase:', e);
      setFirebaseStatus('error');
    }

    showToast(
      'ส่งขออนุมัติสำเร็จ',
      `สร้างคำขอเลขที่ ${createdCase.refNo} และบันทึกลง Firebase เรียบร้อย`,
      'success'
    );
  };

  // Status Counts Calculation
  const statusCounts = useMemo<Record<QueueStatus, number>>(() => {
    const counts: Record<QueueStatus, number> = {
      'เข้ามาใหม่': 0,
      'ใหม่': 0,
      'รอดำเนินการ': 0,
      'เสร็จสิ้น': 0,
      'ตรวจเอกสารผ่าน': 0,
      'อนุมัติตรวจเอกสารผ่าน': 0,
      'ใหม่(แก้ไข)': 0,
      'รอดำเนินการ(แก้ไข)': 0,
      'เอกสารไม่ถูกต้อง': 0,
      'ตรวจสอบพิเศษ': 0,
      'ไม่อนุมัติ': 0,
      'ส่งกลับแก้ไข (รอผู้แทนดำเนินการ)': 0,
    };

    cases.forEach((item) => {
      if (counts[item.status] !== undefined) {
        counts[item.status]++;
      }
    });

    return counts;
  }, [cases]);

  const urgentCount = useMemo(() => {
    return cases.filter(c => c.isUrgent && c.status !== 'เสร็จสิ้น').length;
  }, [cases]);

  const dueTodayCount = useMemo(() => {
    return cases.filter(c => c.dueDate === '2026-09-18' && c.status !== 'เสร็จสิ้น').length;
  }, [cases]);

  const revisedCount = useMemo(() => {
    return (statusCounts['ใหม่(แก้ไข)'] || 0) + (statusCounts['รอดำเนินการ(แก้ไข)'] || 0) + (statusCounts['ส่งกลับแก้ไข (รอผู้แทนดำเนินการ)'] || 0);
  }, [statusCounts]);

  const totalPremiumValue = useMemo(() => {
    return cases.reduce((sum, c) => sum + c.premium, 0);
  }, [cases]);

  // Filtered Cases
  const filteredCases = useMemo(() => {
    return cases.filter((item) => {
      // Filter urgent
      if (filterUrgentOnly && !item.isUrgent) {
        return false;
      }

      // Search query
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase().trim();
        const matchRef = item.refNo.toLowerCase().includes(query);
        const matchPolicy = item.policyNo.toLowerCase().includes(query);
        const matchInsured = item.insuredName.toLowerCase().includes(query);
        const matchAgent = item.agentName.toLowerCase().includes(query) || item.agentCode.toLowerCase().includes(query);
        const matchPayer = item.payerName.toLowerCase().includes(query);

        if (!matchRef && !matchPolicy && !matchInsured && !matchAgent && !matchPayer) {
          return false;
        }
      }

      // Insurance Type
      if (selectedInsuranceType !== 'ทั้งหมด' && item.insuranceType !== selectedInsuranceType) {
        return false;
      }

      // Coverage Term
      if (selectedCoverageTerm !== 'ทั้งหมด' && item.coverageTerm !== selectedCoverageTerm) {
        return false;
      }

      // Queue Status
      if (selectedStatus !== 'ทั้งหมด' && selectedStatus !== '' && item.status !== selectedStatus) {
        return false;
      }

      return true;
    });
  }, [cases, searchQuery, selectedInsuranceType, selectedCoverageTerm, selectedStatus, filterUrgentOnly]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedInsuranceType('ทั้งหมด');
    setSelectedCoverageTerm('ทั้งหมด');
    setSelectedStatus('ทั้งหมด');
    setFilterUrgentOnly(false);
  };

  const handleManualSync = async () => {
    setFirebaseStatus('syncing');
    try {
      const data = await initializeFirestoreData();
      if (data && data.length > 0) {
        setCases(data);
      }
      setFirebaseStatus('synced');
      showToast('ซิงค์ข้อมูลสำเร็จ', 'ข้อมูลตรงกับ Firestore โครงการ smileUDW เรียบร้อย', 'success');
    } catch (e) {
      console.error(e);
      setFirebaseStatus('error');
      showToast('เกิดข้อผิดพลาด', 'ไม่สามารถเชื่อมต่อ Firebase Firestore ได้', 'urgent');
    }
  };

  const handleExportCSV = () => {
    if (filteredCases.length === 0) {
      alert('ไม่มีข้อมูลสำหรับส่งออก');
      return;
    }

    const headers = [
      'ประเภทประกัน',
      'เลขอ้างอิง',
      'ชื่อผู้เอาประกัน',
      'ชื่อผู้ชำระเบี้ย',
      'ชื่อตัวแทน',
      'รหัสตัวแทน',
      'เลขกรมธรรม์',
      'วันที่ครบกำหนด',
      'สถานะคิวงาน',
      'ทุนประกัน (บาท)',
      'เบี้ยประกัน (บาท)'
    ];

    const rows = filteredCases.map(c => [
      `"${c.insuranceType}"`,
      `"${c.refNo}"`,
      `"${c.insuredName}"`,
      `"${c.payerName}"`,
      `"${c.agentName}"`,
      `"${c.agentCode}"`,
      `"${c.policyNo}"`,
      `"${c.dueDate}"`,
      `"${c.status}"`,
      c.sumAssured,
      c.premium
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + 
      [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SmileUnderwrite_Queue_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('ส่งออกข้อมูลสำเร็จ', 'ดาวน์โหลดไฟล์ CSV รายการคิวงานเรียบร้อย', 'success');
  };

  // If inspectingCase is open, display full-screen Underwriting Inspection View matching the screenshot
  if (inspectingCase) {
    return (
      <UnderwritingInspectionDetailView
        caseItem={inspectingCase}
        onBack={() => setInspectingCase(null)}
        onSaveCase={async (updatedCase) => {
          setCases((prev) => prev.map((c) => (c.id === updatedCase.id ? updatedCase : c)));
          try {
            setFirebaseStatus('syncing');
            await saveCaseToFirestore(updatedCase);
            setFirebaseStatus('synced');
          } catch (e) {
            console.error('Failed to sync updated case to Firebase:', e);
            setFirebaseStatus('error');
          }
          showToast('บันทึกสำเร็จ', 'อัปเดตข้อมูลและผลการตรวจสอบสู่ Firebase smileUDW เรียบร้อยแล้ว', 'success');
          setInspectingCase(null);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-slate-900 flex font-['IBM_Plex_Sans_Thai',sans-serif]">
      
      {/* Left Sidebar (Signature deep blue sidebar matching screenshot) */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={(tab: string) => {
          setCurrentTab(tab);
          if (tab === 'applications' || tab === 'products') {
            setViewMode('queue_table');
          } else if (tab === 'dashboard' || tab === 'analytics') {
            setViewMode('dashboard');
          }
        }}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        onOpenNewCase={() => setIsNewCaseModalOpen(true)}
        queueCount={cases.length}
        urgentCount={urgentCount}
      />

      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 animate-in slide-in-from-bottom-3 duration-300">
          <div className={`p-4 rounded-xl shadow-xl border flex items-start space-x-3 max-w-sm ${
            toastMessage.type === 'urgent'
              ? 'bg-rose-50 border-rose-300 text-rose-900'
              : toastMessage.type === 'success'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : 'bg-white border-slate-200 text-slate-800'
          }`}>
            <div className="mt-0.5">
              {toastMessage.type === 'urgent' && <Flame className="w-5 h-5 text-rose-600" />}
              {toastMessage.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
              {toastMessage.type === 'info' && <Info className="w-5 h-5 text-blue-600" />}
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-xs">{toastMessage.title}</h4>
              <p className="text-[11px] text-slate-600 mt-0.5">{toastMessage.message}</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area (offset by sidebar on desktop) */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        
        {/* Top Navbar */}
        <TopNavbar
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          onOpenNewCase={() => setIsNewCaseModalOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          urgentCount={urgentCount}
          firebaseStatus={firebaseStatus}
          onSyncNow={handleManualSync}
        />

        {/* Main Dashboard Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-7 space-y-6 max-w-[1600px] w-full mx-auto">
          
          {/* View Mode Switcher Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-2.5 sm:p-3 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center space-x-1.5 p-1 bg-slate-100/90 rounded-xl">
              <button
                type="button"
                onClick={() => setViewMode('queue_table')}
                className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center space-x-2 ${
                  viewMode === 'queue_table'
                    ? 'bg-[#0072b2] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>หน้ามอนิเตอร์คิวงาน SmileUnderwrite (มุมมองตารางและตัวกรอง)</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('dashboard')}
                className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center space-x-2 ${
                  viewMode === 'dashboard'
                    ? 'bg-[#0a66c2] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Executive Dashboard & สถิติภาพรวม</span>
              </button>
            </div>

            <div className="flex items-center space-x-2 text-xs text-slate-500 pr-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>ระบบอัปเดตเรียลไทม์ · {cases.length} คิวงานในระบบ</span>
            </div>
          </div>

          {/* VIEW 1: SmileUnderwrite Dedicated Queue Table & Floating Filter View (matching screenshot) */}
          {viewMode === 'queue_table' && (
            <SmileUnderwriteQueueSection
              cases={cases}
              onSelectCase={(item: UnderwritingCase) => {
                setSelectedCase(item);
                setModalInitialTab('info');
              }}
              onOpenAuditLog={(item: UnderwritingCase) => {
                setSelectedCase(item);
                setModalInitialTab('history');
              }}
              onOpenEditStatus={(item: UnderwritingCase) => {
                setInspectingCase(item);
              }}
              onOpenNewCaseModal={() => setIsNewCaseModalOpen(true)}
            />
          )}

          {/* VIEW 2: Original Executive Dashboard with Full Metrics & Actions */}
          {viewMode === 'dashboard' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* 1. Hero Welcome Banner with Inset 4 Metrics */}
              <HeroWelcomeBanner
                totalCount={cases.length}
                newCount={statusCounts['เข้ามาใหม่'] || 0}
                totalPremium={totalPremiumValue}
                slaRate={96.8}
                onRefresh={() => {
                  showToast('รีเฟรชสำเร็จ', 'อัปเดตข้อมูลสถานะคิวงานเรียลไทม์ล่าสุดแล้ว', 'info');
                }}
                onExport={handleExportCSV}
                isRealtimeActive={isRealtimeActive}
                onToggleRealtime={() => setIsRealtimeActive(!isRealtimeActive)}
              />

              {/* 2. Five Status Metric Cards Row */}
              <StatusCardsRow
                statusCounts={statusCounts}
                totalCount={cases.length}
                selectedStatus={selectedStatus}
                onSelectStatus={(st: string) => {
                  setSelectedStatus(st);
                  setFilterUrgentOnly(false);
                }}
              />

              {/* 3. Analytics & Live Activity Row */}
              <AnalyticsAndActivityRow
                cases={cases}
                onSelectCase={(item: UnderwritingCase) => {
                  setSelectedCase(item);
                  setModalInitialTab('info');
                }}
              />

              {/* 4. Quick Actions & Top Agents Row */}
              <QuickActionsAndTopAgents
                onOpenNewCase={() => setIsNewCaseModalOpen(true)}
                onFilterUrgent={() => {
                  setFilterUrgentOnly(true);
                  setSelectedStatus('ทั้งหมด');
                }}
                onOpenAnalytics={() => {
                  showToast('เกณฑ์การพิจารณา', 'ระบบเปิดใช้งาน Underwriting Matrix Version 4.2', 'info');
                }}
                onExportReports={handleExportCSV}
              />

              {/* 5. Pending Actions */}
              <PendingActionsRow
                urgentCount={urgentCount}
                revisedCount={revisedCount}
                dueTodayCount={dueTodayCount}
                onFilterStatus={(st: QueueStatus | 'ด่วน') => {
                  if (st === 'ด่วน') {
                    setFilterUrgentOnly(true);
                    setSelectedStatus('ทั้งหมด');
                  } else {
                    setFilterUrgentOnly(false);
                    setSelectedStatus(st);
                  }
                }}
              />

              {/* 6. Dashboard Work Queue Table */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <Layers className="w-5 h-5 text-[#0a66c2]" />
                      ตารางมอนิเตอร์คิวงานและตรวจสอบรายการส่งขออนุมัติ
                    </h3>
                    <p className="text-xs text-slate-500">
                      บริหารจัดการคิวงานในแต่ละวัน ดูรายละเอียดเชิงลึกและอัปเดตสถานะงานรายบุคคลได้ทันที
                    </p>
                  </div>
                </div>

                {/* Filters Bar */}
                <FilterBar
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  selectedInsuranceType={selectedInsuranceType}
                  onInsuranceTypeChange={setSelectedInsuranceType}
                  selectedCoverageTerm={selectedCoverageTerm}
                  onCoverageTermChange={setSelectedCoverageTerm}
                  selectedStatus={selectedStatus}
                  onStatusChange={(st: string) => {
                    setSelectedStatus(st);
                    setFilterUrgentOnly(false);
                  }}
                  onResetFilters={handleResetFilters}
                  onExportData={handleExportCSV}
                  totalFilteredCount={filteredCases.length}
                />

                {/* Main Work Queue Table */}
                <QueueTable
                  cases={filteredCases}
                  onSelectCase={(item: UnderwritingCase) => {
                    setSelectedCase(item);
                    setModalInitialTab('info');
                  }}
                  onOpenEditStatus={(item: UnderwritingCase) => {
                    setInspectingCase(item);
                  }}
                  onUpdateStatus={handleUpdateStatus}
                  onResetFilters={handleResetFilters}
                />
              </div>
            </div>
          )}

        </main>

        {/* Deep Detail Case Modal */}
        <CaseDetailModal
          caseItem={selectedCase}
          initialTab={modalInitialTab}
          onClose={() => setSelectedCase(null)}
          onUpdateStatus={handleUpdateStatus}
          onAddNote={handleAddNote}
          onInspectCase={(item: UnderwritingCase) => {
            setSelectedCase(null);
            setInspectingCase(item);
          }}
        />

        {/* New Application Modal */}
        <NewCaseModal
          isOpen={isNewCaseModalOpen}
          onClose={() => setIsNewCaseModalOpen(false)}
          onSubmit={handleCreateNewCase}
        />

      </div>

    </div>
  );
}
