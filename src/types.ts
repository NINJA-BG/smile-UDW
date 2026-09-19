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
  | 'ไม่อนุมัติ';

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
}
