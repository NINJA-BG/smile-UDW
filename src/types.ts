export type QueueStatus = 
  | 'เข้ามาใหม่'
  | 'ใหม่'
  | 'รอดำเนินการ'
  | 'เสร็จสิ้น'
  | 'ตรวจเอกสารผ่าน'
  | 'อนุมัติตรวจเอกสารผ่าน'
  | 'ใหม่(แก้ไข)'
  | 'รอดำเนินการ(แก้ไข)'
  | 'เอกสารไม่ถูกต้อง'
  | 'ตรวจสอบพิเศษ'
  | 'ไม่อนุมัติ'
  | 'ส่งกลับแก้ไข (รอผู้แทนดำเนินการ)';

export type InsuranceType =
  | 'ประกันชีวิต (Life)'
  | 'ประกันสุขภาพ (Health)'
  | 'ประกันอุบัติเหตุ (PA)'
  | 'ประกันโรคร้ายแรง (CI)'
  | 'ประกันออมทรัพย์/บำนาญ (Endowment)'
  | 'ประกันควบการลงทุน (Unit Linked)';

export type CoverageTerm =
  | 'รายเดือน (Monthly)'
  | 'ราย 3 เดือน (Quarterly)'
  | 'ราย 6 เดือน (Semi-Annual)'
  | 'รายปี (Annual)'
  | 'ชำระครั้งเดียว (Single Premium)';

export interface DocumentAttachment {
  id: string;
  name: string;
  type: string;
  status: 'ครบถ้วน' | 'รอเพิ่มเติม' | 'ไม่ผ่านเกณฑ์';
  uploadDate: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  action: string;
  note: string;
}

export interface UnderwritingCase {
  id: string;
  refNo: string; // เลขอ้างอิง เช่น UW-2025-0812
  applicationNo?: string; // เลขที่ Application เช่น 690300001
  policyNo: string; // เลขกรมธรรม์ เช่น POL-68090123
  insuranceType: InsuranceType; // ประเภทประกัน
  coverageTerm: CoverageTerm; // งวดความคุ้มครอง / ความถี่ชำระเบี้ย
  coverageStartDate?: string; // วันที่เริ่มคุ้มครอง เช่น 01/10/2569
  expiryDate?: string; // วันที่หมดอายุ เช่น 20/10/2569 21:00:00
  checkpointsCount?: number; // จุดตรวจสอบ เช่น 3, 1, 0
  insuredName: string; // ชื่อผู้เอาประกันภัย
  insuredAge: number;
  insuredGender: 'ชาย' | 'หญิง';
  insuredOccupation: string;
  insuredIdCard: string;
  payerName: string; // ชื่อผู้ชำระเบี้ย
  payerRelation: string; // ความสัมพันธ์ เช่น ตนเอง, คู่สมรส, บิดา, มารดา, บุตร
  agentName: string; // ชื่อตัวแทน
  agentCode: string; // รหัสตัวแทน
  agentBranch: string; // สาขา
  agentPhone: string;
  dueDate: string; // วันที่ครบกำหนด (YYYY-MM-DD)
  submittedDate: string; // วันที่ยื่นเอกสาร
  status: QueueStatus; // สถานะคิวงาน
  sumAssured: number; // ทุนประกันภัย (บาท)
  premium: number; // เบี้ยประกันภัย (บาท)
  riskLevel: 'ต่ำ (Standard)' | 'ปานกลาง (Medium)' | 'สูง (High Risk)' | 'ข้อยกเว้นพิเศษ';
  underwriterAssigned?: string; // ผู้พิจารณาที่รับผิดชอบ
  healthConditions?: string[];
  documents: DocumentAttachment[];
  history: AuditLog[];
  remarks?: string;
  isUrgent?: boolean;
  hasDocumentError?: boolean; // ธงแจ้งเอกสารผิด / มีข้อผิดพลาดในเอกสาร
  documentErrorReason?: string; // สาเหตุเอกสารผิด เช่น ลายเซ็นไม่ตรง, สำเนาบัตรหมดอายุ
  requiresSpecialInspection?: boolean; // ต้องตรวจสอบพิเศษ
  specialInspectionType?: 'เอกสารผิด' | 'ทุนสูงผิดปกติ' | 'ประวัติสุขภาพ' | 'สงสัยทุจริต' | 'อื่นๆ';
  customerChangeRequest?: CustomerChangeRequest; // ข้อมูลการแจ้งขอแก้ไขข้อมูลจากลูกค้าหรือผู้ให้บริการ
  healthProfile?: HealthProfile; // ข้อมูลแถลงสุขภาพเชิงลึกและเคสจำลอง
}

export type HealthScenarioType = 
  | 'standard_normal' // สุขภาพปกติ สมบูรณ์ตามเกณฑ์
  | 'abnormal_surgery_cyst' // เคสผิดปกติ: ผ่าตัดซีสต์รังไข่ / นอน รพ. (ต้องการ APS)
  | 'abnormal_hypertension_bmi' // เคสผิดปกติ: ความดันโลหิตสูง & ไขมันสูง (BMI 29.8 เกินเกณฑ์ / ปรับเพิ่มเบี้ย +25%)
  | 'abnormal_tumor_pending'; // เคสผิดปกติ: ตรวจพบก้อนเนื้อเต้านมรอผล Biopsy (ระงับรับประกัน Postpone / ไม่อนุมัติ)

export interface HealthProfile {
  scenarioType: HealthScenarioType;
  heightCm: number;
  weightKg: number;
  bmi: number;
  bloodPressure: string;
  pulseBpm: number;
  smokingStatus: string;
  alcoholStatus: string;
  hasAbnormalFindings: boolean;
  isAbnormal?: boolean;
  abnormalSummary?: string;
  summaryFlag?: string;
  suggestedAction?: 'standard' | 'request_aps' | 'increase_premium' | 'decline_postpone';
  suggestedNote?: string;
}

export interface CustomerChangeRequest {
  hasRequest: boolean; // มีการกดขอแก้ไขข้อมูลเข้ามาหรือไม่
  source: 'ลูกค้า (Customer)' | 'ผู้ให้บริการ (Service Provider / Agent)'; // แหล่งที่มาของการแจ้ง
  requesterName: string; // ชื่อผู้แจ้ง เช่น คุณทานตะวัน (ลูกค้า) หรือ คุณสมชาย (ศูนย์บริการลูกค้า)
  requesterRole?: string; // บทบาท เช่น ผู้เอาประกันภัย, เจ้าหน้าที่ Call Center, ผู้แทนฝ่ายขาย
  requestDate: string; // วันที่แจ้ง เช่น 18/09/2569
  requestTime: string; // เวลาที่แจ้ง เช่น 14:25 น.
  category: 'ข้อมูลผู้ชำระเบี้ย' | 'ข้อมูลผู้เอาประกัน' | 'ที่อยู่จัดส่งเอกสาร' | 'บัญชี/วิธีชำระเงิน' | 'อื่นๆ';
  reason: string; // สาเหตุหรือหัวข้อการขอเปลี่ยน เช่น ขอเปลี่ยนผู้ชำระเบี้ยเป็นคู่สมรส
  details: string; // รายละเอียดการขอเปลี่ยน
  oldValue?: string; // ข้อมูลเดิม
  newValue?: string; // ข้อมูลใหม่ที่ต้องการเปลี่ยน
  attachedDocuments?: string[]; // เอกสารประกอบการขอแก้ไขที่แนบมา
  status: 'รอดำเนินการตรวจ' | 'รับทราบและปรับปรุงแล้ว' | 'ปฏิเสธคำขอ';
}

