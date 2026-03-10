import { useState, useEffect, createContext, useContext } from 'react'
import { 
  Brain, 
  Zap, 
  Clock, 
  TrendingUp, 
  Shield, 
  AlertTriangle,
  Plus,
  Trash2,
  RotateCcw,
  ChevronRight,
  Terminal,
  Cpu,
  Target,
  Activity,
  TriangleAlert,
  X,
  Lock,
  Unlock,
  ShieldAlert,
  ShieldCheck,
  Bug,
  Server,
  AlertOctagon,
  Ban,
  CheckCircle2
} from 'lucide-react'

const STORAGE_KEYS = {
  SKILLS: 'cas-engine-skills',
  DEFENSES: 'cas-engine-defenses',
  MATRIX: 'cas-engine-matrix',
}

const DEFAULT_SKILLS = [
  { id: 1, name: '心理洞察与叙事表达', beta: 2, alpha: 10, substitutability: 0.1 },
  { id: 2, name: 'AI Harness (业务流整合)', beta: 1, alpha: 10, substitutability: 0.1 },
  { id: 3, name: '广义投资体系', beta: 3, alpha: 8, substitutability: 0.2 },
  { id: 4, name: '功能性塑形与游泳', beta: 1, alpha: 6, substitutability: 0.1 },
  { id: 5, name: '驾驶与空间导航', beta: 4, alpha: 3, substitutability: 0.5 },
  { id: 6, name: '英语 (国内环境)', beta: 1, alpha: 4, substitutability: 0.8 },
]

const DEFAULT_DEFENSES = [
  { id: 1, name: '灰指甲与基础体味管理', lethality: 5, patchType: 'daemon', status: false, hoursNeeded: 0 },
  { id: 2, name: '数字隐私与多端隔离', lethality: 5, patchType: 'one-time', status: false, hoursNeeded: 2 },
  { id: 3, name: '婚前/高风险合同防御常识', lethality: 4, patchType: 'one-time', status: false, hoursNeeded: 1 },
]

const DEFAULT_MATRIX = [
  {
    id: 'PATCH',
    name: '系统修复区块 (System Patch Block)',
    schedule: '预留',
    duration: '弹性',
    slots: [
      { id: 'P1', name: 'Beta 漏洞修复时段', duration: '待分配', assigned: null, type: 'patch' },
    ]
  },
  {
    id: 'A',
    name: '模块A: 碎片/通勤流',
    schedule: '周一至周五',
    duration: '80 分钟/天',
    slots: [
      { id: 'A1', name: '导航与物流推演', duration: '40分钟', assigned: '驾驶与空间导航', type: 'weekday' },
      { id: 'A2', name: '心理洞察与叙事脱口秀拆解', duration: '40分钟', assigned: '心理洞察与叙事表达', type: 'weekday' },
    ]
  },
  {
    id: 'B',
    name: '模块B: 晚间高压流',
    schedule: '周一至周五',
    duration: '90 分钟/天',
    slots: [
      { id: 'B1', name: '功能性塑形/游泳', duration: '45分钟', days: '一三五', assigned: '功能性塑形与游泳', type: 'weekday-evening' },
      { id: 'B2', name: 'AI工作流实操', duration: '45分钟', days: '一三五', assigned: 'AI Harness (业务流整合)', type: 'weekday-evening' },
      { id: 'B3', name: 'AI高压心理模拟/叙事实战', duration: '60分钟', days: '二四', assigned: '心理洞察与叙事表达', type: 'weekday-evening' },
      { id: 'B4', name: '厨艺自娱/投资机械看盘', duration: '30分钟', days: '二四', assigned: '广义投资体系', type: 'weekday-evening' },
    ]
  },
  {
    id: 'C',
    name: '模块C: 周六集中变现',
    schedule: '周六',
    duration: '10 小时',
    slots: [
      { id: 'C1', name: '驾驶实战 / AI深度攻坚', duration: '4小时', assigned: '驾驶与空间导航', type: 'weekend' },
      { id: 'C2', name: 'AI业务流深度开发', duration: '2.5小时', assigned: 'AI Harness (业务流整合)', type: 'weekend' },
      { id: 'C3', name: '投资系统宏观检视与调仓', duration: '0.5小时', assigned: '广义投资体系', type: 'weekend' },
      { id: 'C4', name: '真实社交实测 / 叙事表达与心理干预变现', duration: '3小时', assigned: '心理洞察与叙事表达', type: 'weekend' },
    ]
  },
  {
    id: 'D',
    name: '模块D: 绝对黑障期',
    schedule: '周日',
    duration: '全天',
    slots: [
      { id: 'D1', name: '彻底断电。禁止学习，禁止复盘，离线固化记忆', duration: '24小时', assigned: null, type: 'blackout' },
    ]
  },
]

const calculateScore = (beta, alpha, substitutability) => {
  return beta + (alpha * (1 - substitutability))
}

const getTierInfo = (score) => {
  if (score >= 10) {
    return { tier: 'T0', label: '核心引擎', color: 'bg-terminal-red', text: 'text-terminal-red', border: 'border-terminal-red' }
  } else if (score >= 7) {
    return { tier: 'T1', label: '杠杆/防御', color: 'bg-terminal-orange', text: 'text-terminal-orange', border: 'border-terminal-orange' }
  } else if (score >= 4) {
    return { tier: 'T2', label: '战术配件', color: 'bg-terminal-blue', text: 'text-terminal-blue', border: 'border-terminal-blue' }
  } else {
    return { tier: 'TX', label: '弃置/外包', color: 'bg-terminal-gray', text: 'text-terminal-gray', border: 'border-terminal-gray' }
  }
}

const getSlotPriority = (type) => {
  const priorities = {
    weekend: 3,
    'weekday-evening': 2,
    weekday: 1,
    blackout: 0,
    patch: 4,
  }
  return priorities[type] || 0
}

const AppContext = createContext()

export function useApp() {
  return useContext(AppContext)
}

function CoreConcepts() {
  const { defenses } = useApp()
  
  const criticalUnpatched = defenses.filter(d => d.lethality >= 4 && !d.status)
  const hasCritical = criticalUnpatched.length > 0
  const allSecured = defenses.every(d => d.status)

  return (
    <div className="grid gap-4">
      <div className="bg-terminal-card border border-terminal-border p-5 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-1 h-full bg-terminal-green"></div>
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-5 h-5 text-terminal-green" />
          <h3 className="text-lg font-bold tracking-wider text-terminal-green">
            技能习得非线性公式 <span className="text-xs text-mono-300 ml-1 font-normal">Skill Acquisition Formula</span>
          </h3>
        </div>
        <div className="text-2xl font-bold mb-4 text-mono-100 font-mono">
          <span className="text-terminal-green">掌握程度</span> = (E × R - D) × T
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-terminal-bg p-3 border border-terminal-border">
            <span className="text-terminal-blue font-bold">E</span>
            <span className="text-mono-200 ml-1">心力/认知带宽 <span className="text-xs text-mono-300">(Cognitive Bandwidth)</span></span>
          </div>
          <div className="bg-terminal-bg p-3 border border-terminal-border">
            <span className="text-terminal-blue font-bold">R</span>
            <span className="text-mono-200 ml-1">有效纠偏效率/反馈颗粒度 <span className="text-xs text-mono-300">(Feedback Granularity)</span></span>
          </div>
          <div className="bg-terminal-bg p-3 border border-terminal-border">
            <span className="text-terminal-red font-bold">D</span>
            <span className="text-mono-200 ml-1">系统损耗/情绪摩擦 <span className="text-xs text-mono-300">(System Loss / Friction)</span></span>
          </div>
          <div className="bg-terminal-bg p-3 border border-terminal-border">
            <span className="text-terminal-orange font-bold">T</span>
            <span className="text-mono-200 ml-1">绝对时间 <span className="text-xs text-mono-300">(Absolute Time)</span></span>
          </div>
        </div>
        <div className="mt-4 p-3 border-l-2 border-terminal-warning bg-terminal-warning/10">
          <p className="text-mono-200 text-sm">
            普通人死于低<span className="text-terminal-red">E</span>、零<span className="text-terminal-red">R</span>、高<span className="text-terminal-red">D</span>，妄图用无限的<span className="text-terminal-orange">T</span>弥补。本系统通过AI工具提升<span className="text-terminal-green">R</span>，通过极简排期压制<span className="text-terminal-green">D</span>。
          </p>
        </div>
      </div>

      <div className="bg-terminal-card border border-terminal-border p-5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-terminal-blue"></div>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-terminal-blue" />
          <h3 className="text-lg font-bold tracking-wider text-terminal-blue">
            技能演化四阶段 <span className="text-xs text-mono-300 ml-1 font-normal">Four Stages of Skill Evolution</span>
          </h3>
        </div>
        <div className="space-y-2">
          {[
            { stage: '拓荒期', desc: '高算力消耗，机械拟合', eng: 'Exploration Phase', status: 'HIGH_COST' },
            { stage: '高原期', desc: '基底核接管，自动化陷阱', eng: 'Plateau Phase', status: 'WARNING' },
            { stage: '破壁期', desc: '算法解构，微粒度重塑', eng: 'Breaking Phase', status: 'KEY' },
            { stage: '大师期', desc: '跨域涌现，直觉化', eng: 'Mastery Phase', status: 'DONE' },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-3 p-2 bg-terminal-bg border border-terminal-border">
              <div className={`w-8 h-8 flex items-center justify-center text-xs font-bold ${
                item.status === 'KEY' ? 'bg-terminal-green text-white' :
                item.status === 'WARNING' ? 'bg-terminal-warning text-white' :
                item.status === 'DONE' ? 'bg-terminal-blue text-white' :
                'bg-mono-400 text-white'
              }`}>
                {idx + 1}
              </div>
              <div className="flex-1">
                <span className="font-bold text-mono-100">{item.stage}</span>
                <span className="text-mono-300 ml-2 text-sm">— {item.desc}</span>
                <span className="text-xs text-mono-300 ml-1">({item.eng})</span>
              </div>
              <ChevronRight className="w-4 h-4 text-mono-300" />
            </div>
          ))}
        </div>
      </div>

      <div className={`bg-terminal-card border-2 p-5 relative overflow-hidden transition-all duration-500 ${
        hasCritical 
          ? 'border-terminal-red animate-pulse' 
          : allSecured 
            ? 'border-terminal-green bg-terminal-green/5' 
            : 'border-terminal-orange'
      }`}>
        <div className={`absolute top-0 left-0 w-1 h-full ${
          hasCritical ? 'bg-terminal-red animate-pulse' : allSecured ? 'bg-terminal-green' : 'bg-terminal-orange'
        }`}></div>
        <div className="flex items-center gap-2 mb-4">
          {hasCritical ? (
            <AlertOctagon className="w-6 h-6 text-terminal-red animate-pulse" />
          ) : allSecured ? (
            <ShieldCheck className="w-6 h-6 text-terminal-green" />
          ) : (
            <Shield className="w-6 h-6 text-terminal-orange" />
          )}
          <h3 className={`text-lg font-bold tracking-wider ${
            hasCritical ? 'text-terminal-red' : allSecured ? 'text-terminal-green' : 'text-terminal-orange'
          }`}>
            系统完整性监控 <span className="text-xs text-mono-300 ml-1 font-normal">System Integrity Monitor</span>
          </h3>
        </div>
        
        {hasCritical ? (
          <div className="space-y-2">
            <div className="bg-terminal-red/20 border border-terminal-red p-3 font-mono text-xs">
              <div className="text-terminal-red font-bold mb-2">⚠️ CRITICAL ERR: Hull breach detected</div>
              <div className="text-mono-200">
                {criticalUnpatched.map(d => (
                  <div key={d.id} className="flex items-center gap-2">
                    <Ban className="w-3 h-3 text-terminal-red" />
                    <span>[{d.name}] - LETHALITY: {d.lethality}/5 - Immediate patching required</span>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-terminal-red text-sm font-bold">
              在桶底破洞被堵住之前，禁止向系统注入更多高阶算力。
            </p>
          </div>
        ) : allSecured ? (
          <div className="bg-terminal-green/20 border border-terminal-green p-3">
            <div className="flex items-center gap-2 text-terminal-green font-mono text-sm">
              <CheckCircle2 className="w-4 h-4" />
              <span>SYSTEM SECURE. Ready for Alpha Scaling.</span>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-mono-200 text-sm mb-4">
              动力系统（Alpha收益）再强，底层漏洞（Beta惩罚）也会让资产瞬间归零。
            </p>
            <div className="space-y-2">
              {defenses.filter(d => !d.status).map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2 bg-terminal-orange/10 border border-terminal-orange/30">
                  <AlertTriangle className="w-4 h-4 text-terminal-orange" />
                  <span className="text-mono-200 text-sm">{item.name}</span>
                  <span className="ml-auto text-terminal-orange text-xs font-bold">L{item.lethality}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function ArbitrageEngine({ skills, setSkills, defenses, setDefenses, onBlockAllocation }) {
  const [activeSegment, setActiveSegment] = useState('alpha')
  const [newSkill, setNewSkill] = useState({ name: '', beta: 2, alpha: 5, substitutability: 0.5 })
  const [showAddForm, setShowAddForm] = useState(false)
  const [newDefense, setNewDefense] = useState({ name: '', lethality: 3, patchType: 'one-time', hoursNeeded: 1 })
  const [showAddDefense, setShowAddDefense] = useState(false)

  const addSkill = () => {
    if (!newSkill.name.trim()) return
    const id = Date.now()
    setSkills([...skills, { ...newSkill, id }])
    setNewSkill({ name: '', beta: 2, alpha: 5, substitutability: 0.5 })
    setShowAddForm(false)
  }

  const deleteSkill = (id) => {
    setSkills(skills.filter(s => s.id !== id))
  }

  const updateSkill = (id, field, value) => {
    setSkills(skills.map(s => s.id === id ? { ...s, [field]: value } : s))
  }

  const addDefense = () => {
    if (!newDefense.name.trim()) return
    const id = Date.now()
    setDefenses([...defenses, { ...newDefense, id, status: false }])
    setNewDefense({ name: '', lethality: 3, patchType: 'one-time', hoursNeeded: 1 })
    setShowAddDefense(false)
  }

  const deleteDefense = (id) => {
    setDefenses(defenses.filter(d => d.id !== id))
  }

  const toggleDefense = (id) => {
    setDefenses(defenses.map(d => d.id === id ? { ...d, status: !d.status } : d))
  }

  const criticalUnpatched = defenses.filter(d => d.lethality >= 5 && !d.status)

  return (
    <div className="space-y-4">
      <div className="bg-terminal-card border border-terminal-border p-1 rounded-lg inline-flex">
        <button
          onClick={() => setActiveSegment('alpha')}
          className={`flex items-center gap-2 px-4 py-2 text-sm rounded-md transition-all ${
            activeSegment === 'alpha'
              ? 'bg-terminal-blue text-white'
              : 'text-mono-300 hover:text-mono-100'
          }`}
        >
          <Zap className="w-4 h-4" />
          Alpha 动力引擎
        </button>
        <button
          onClick={() => setActiveSegment('beta')}
          className={`flex items-center gap-2 px-4 py-2 text-sm rounded-md transition-all relative ${
            activeSegment === 'beta'
              ? 'bg-terminal-red text-white'
              : 'text-mono-300 hover:text-mono-100'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          Beta 制动系统
          {criticalUnpatched.length > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-terminal-red text-white text-xs rounded-full flex items-center justify-center animate-pulse">
              {criticalUnpatched.length}
            </span>
          )}
        </button>
      </div>

      {activeSegment === 'alpha' && (
        <>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-terminal-green" />
              <span className="text-mono-200 text-sm">公式: Priority Score = β + (α × (1 - S))</span>
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-2 px-3 py-1.5 bg-terminal-green/20 border border-terminal-green text-terminal-green hover:bg-terminal-green/30 transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              添加技能
            </button>
          </div>

          {showAddForm && (
            <div className="bg-terminal-card border border-terminal-green p-4 mb-4">
              <div className="grid gap-4">
                <input
                  type="text"
                  value={newSkill.name}
                  onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                  placeholder="技能名称"
                  className="w-full bg-terminal-bg border border-terminal-border p-2 text-mono-100 placeholder-mono-300 focus:border-terminal-green outline-none"
                />
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs text-mono-300 block mb-1">Beta (β): {newSkill.beta}</label>
                    <input
                      type="range"
                      min="0"
                      max="5"
                      step="0.1"
                      value={newSkill.beta}
                      onChange={(e) => setNewSkill({ ...newSkill, beta: parseFloat(e.target.value) })}
                      className="w-full accent-terminal-red"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-mono-300 block mb-1">Alpha (α): {newSkill.alpha}</label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      step="0.1"
                      value={newSkill.alpha}
                      onChange={(e) => setNewSkill({ ...newSkill, alpha: parseFloat(e.target.value) })}
                      className="w-full accent-terminal-green"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-mono-300 block mb-1">S: {newSkill.substitutability}</label>
                    <input
                      type="range"
                      min="0.1"
                      max="0.9"
                      step="0.1"
                      value={newSkill.substitutability}
                      onChange={(e) => setNewSkill({ ...newSkill, substitutability: parseFloat(e.target.value) })}
                      className="w-full accent-terminal-blue"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={addSkill}
                    className="flex-1 py-2 bg-terminal-green text-white font-bold hover:bg-terminal-green/80 transition-colors"
                  >
                    确认添加
                  </button>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 border border-terminal-border text-mono-200 hover:bg-terminal-border transition-colors"
                  >
                    取消
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            {skills.map((skill) => {
              const score = calculateScore(skill.beta, skill.alpha, skill.substitutability)
              const tierInfo = getTierInfo(score)
              
              return (
                <div key={skill.id} className="bg-terminal-card border border-terminal-border p-4 hover:border-mono-400 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-bold text-mono-100">{skill.name}</h4>
                        <span className={`px-2 py-0.5 text-xs font-bold ${tierInfo.color} text-white`}>
                          {tierInfo.tier} {tierInfo.label}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-3 mb-2">
                        <div>
                          <label className="text-xs text-mono-300">β: {skill.beta}</label>
                          <input
                            type="range"
                            min="0"
                            max="5"
                            step="0.1"
                            value={skill.beta}
                            onChange={(e) => updateSkill(skill.id, 'beta', parseFloat(e.target.value))}
                            className="w-full h-1 accent-terminal-red"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-mono-300">α: {skill.alpha}</label>
                          <input
                            type="range"
                            min="1"
                            max="10"
                            step="0.1"
                            value={skill.alpha}
                            onChange={(e) => updateSkill(skill.id, 'alpha', parseFloat(e.target.value))}
                            className="w-full h-1 accent-terminal-green"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-mono-300">S: {skill.substitutability}</label>
                          <input
                            type="range"
                            min="0.1"
                            max="0.9"
                            step="0.1"
                            value={skill.substitutability}
                            onChange={(e) => updateSkill(skill.id, 'substitutability', parseFloat(e.target.value))}
                            className="w-full h-1 accent-terminal-blue"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2">
                      <div className={`text-2xl font-bold ${tierInfo.text}`}>
                        {score.toFixed(1)}
                      </div>
                      <button
                        onClick={() => deleteSkill(skill.id)}
                        className="p-1.5 text-mono-300 hover:text-terminal-red hover:bg-terminal-red/10 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-6 p-4 bg-terminal-bg border border-terminal-border">
            <div className="flex items-center gap-2 mb-3">
              <Cpu className="w-4 h-4 text-mono-300" />
              <span className="text-mono-300 text-sm font-bold">等级定义 <span className="text-xs font-normal">TIER DEFINITIONS</span></span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-terminal-red"></span>
                <span className="text-mono-200">T0 (≥10): 核心引擎</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-terminal-orange"></span>
                <span className="text-mono-200">T1 (7-9.9): 杠杆/防御</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-terminal-blue"></span>
                <span className="text-mono-200">T2 (4-6.9): 战术配件</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-terminal-gray"></span>
                <span className="text-mono-200">TX (&lt;4): 弃置/外包</span>
              </div>
            </div>
          </div>
        </>
      )}

      {activeSegment === 'beta' && (
        <>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Server className="w-5 h-5 text-terminal-red" />
              <span className="text-mono-200 text-sm">制动漏洞修复 / Beta Vulnerability Patching</span>
            </div>
            <button
              onClick={() => setShowAddDefense(!showAddDefense)}
              className="flex items-center gap-2 px-3 py-1.5 bg-terminal-red/20 border border-terminal-red text-terminal-red hover:bg-terminal-red/30 transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              添加漏洞
            </button>
          </div>

          {showAddDefense && (
            <div className="bg-terminal-card border border-terminal-red p-4 mb-4">
              <div className="grid gap-4">
                <input
                  type="text"
                  value={newDefense.name}
                  onChange={(e) => setNewDefense({ ...newDefense, name: e.target.value })}
                  placeholder="漏洞名称"
                  className="w-full bg-terminal-bg border border-terminal-border p-2 text-mono-100 placeholder-mono-300 focus:border-terminal-red outline-none"
                />
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs text-mono-300 block mb-1">Lethality (致死率): {newDefense.lethality}</label>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      step="1"
                      value={newDefense.lethality}
                      onChange={(e) => setNewDefense({ ...newDefense, lethality: parseInt(e.target.value) })}
                      className="w-full accent-terminal-red"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-mono-300 block mb-1">修复类型</label>
                    <select
                      value={newDefense.patchType}
                      onChange={(e) => setNewDefense({ ...newDefense, patchType: e.target.value })}
                      className="w-full bg-terminal-bg border border-terminal-border p-2 text-mono-100 focus:border-terminal-red outline-none"
                    >
                      <option value="daemon">Daemon Process (后台守护)</option>
                      <option value="one-time">One-Time Setup (单次部署)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-mono-300 block mb-1">需小时数: {newDefense.hoursNeeded}h</label>
                    <input
                      type="number"
                      min="0"
                      max="20"
                      step="0.5"
                      value={newDefense.hoursNeeded}
                      onChange={(e) => setNewDefense({ ...newDefense, hoursNeeded: parseFloat(e.target.value) })}
                      className="w-full bg-terminal-bg border border-terminal-border p-2 text-mono-100 focus:border-terminal-red outline-none"
                      disabled={newDefense.patchType === 'daemon'}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={addDefense}
                    className="flex-1 py-2 bg-terminal-red text-white font-bold hover:bg-terminal-red/80 transition-colors"
                  >
                    确认添加
                  </button>
                  <button
                    onClick={() => setShowAddDefense(false)}
                    className="px-4 py-2 border border-terminal-border text-mono-200 hover:bg-terminal-border transition-colors"
                  >
                    取消
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            {defenses.map((defense) => (
              <div key={defense.id} className={`bg-terminal-card border p-4 transition-all ${
                defense.status 
                  ? 'border-terminal-green bg-terminal-green/5' 
                  : defense.lethality >= 4 
                    ? 'border-terminal-red bg-terminal-red/5' 
                    : 'border-terminal-border'
              }`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Bug className={`w-4 h-4 ${defense.status ? 'text-terminal-green' : defense.lethality >= 4 ? 'text-terminal-red' : 'text-terminal-orange'}`} />
                      <h4 className={`font-bold ${defense.status ? 'text-terminal-green' : 'text-mono-100'}`}>
                        {defense.name}
                      </h4>
                      <span className={`px-2 py-0.5 text-xs font-bold ${
                        defense.status 
                          ? 'bg-terminal-green text-white' 
                          : defense.lethality >= 4 
                            ? 'bg-terminal-red text-white' 
                            : 'bg-terminal-orange text-white'
                      }`}>
                        L{defense.lethality}
                      </span>
                      <span className={`px-2 py-0.5 text-xs font-bold ${
                        defense.patchType === 'daemon' ? 'bg-terminal-blue text-white' : 'bg-mono-400 text-white'
                      }`}>
                        {defense.patchType === 'daemon' ? 'Daemon' : 'One-Time'}
                      </span>
                      {defense.patchType === 'one-time' && (
                        <span className="text-xs text-mono-300">{defense.hoursNeeded}h</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleDefense(defense.id)}
                      className={`flex items-center gap-1 px-3 py-1.5 text-sm font-bold transition-colors ${
                        defense.status 
                          ? 'bg-terminal-green text-white' 
                          : 'bg-terminal-red/20 text-terminal-red hover:bg-terminal-red/30'
                      }`}
                    >
                      {defense.status ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          Secured
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-4 h-4" />
                          Unpatched
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => deleteDefense(defense.id)}
                      className="p-1.5 text-mono-300 hover:text-terminal-red hover:bg-terminal-red/10 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-terminal-bg border border-terminal-border">
            <div className="flex items-center gap-2 mb-3">
              <ShieldAlert className="w-4 h-4 text-terminal-red" />
              <span className="text-mono-300 text-sm font-bold">修复类型说明</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-terminal-blue/10 border border-terminal-blue/30">
                <div className="flex items-center gap-2 text-terminal-blue font-bold mb-1">
                  <Server className="w-3 h-3" />
                  <span>Daemon Process / 后台守护进程</span>
                </div>
                <div className="text-mono-300">
                  洗漱/服药/定期卫生管理等固化习惯，<span className="text-terminal-green">不计入 18 小时</span>，需融入本能
                </div>
              </div>
              <div className="p-3 bg-terminal-orange/10 border border-terminal-orange/30">
                <div className="flex items-center gap-2 text-terminal-orange font-bold mb-1">
                  <Clock className="w-3 h-3" />
                  <span>One-Time Setup / 单次部署</span>
                </div>
                <div className="text-mono-300">
                  就医/软件配置/法律咨询等，需一次性分配<span className="text-terminal-orange">明确小时数</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function MatrixPanel({ matrix, setMatrix, skills, defenses, onBlockAllocation }) {
  const [warning, setWarning] = useState(null)
  const [draggedSkill, setDraggedSkill] = useState(null)
  const [interruptModal, setInterruptModal] = useState(null)

  const resetToDefault = () => {
    setMatrix(DEFAULT_MATRIX)
    setWarning(null)
  }

  const getSkillScore = (skillName) => {
    const skill = skills.find(s => s.name === skillName)
    if (!skill) return 0
    return calculateScore(skill.beta, skill.alpha, skill.substitutability)
  }

  const handleDragStart = (skillName) => {
    setDraggedSkill(skillName)
  }

  const checkCriticalBlock = (slotType) => {
    if (['weekend', 'weekday-evening'].includes(slotType)) {
      const criticalL5 = defenses.filter(d => d.lethality === 5 && !d.status)
      if (criticalL5.length > 0) {
        return criticalL5[0]
      }
    }
    return null
  }

  const handleDrop = (slotId, assignedSkill, slotType) => {
    if (!draggedSkill) return
    
    const blockedBy = checkCriticalBlock(slotType)
    if (blockedBy) {
      setInterruptModal({
        skill: draggedSkill,
        defense: blockedBy,
        slotId,
      })
      setDraggedSkill(null)
      return
    }
    
    const score = getSkillScore(draggedSkill)
    const slot = matrix.flatMap(m => m.slots).find(s => s.id === slotId)
    
    if (slot) {
      const slotPriority = getSlotPriority(slot.type)
      const scorePriority = score >= 10 ? 3 : score >= 7 ? 2 : score >= 4 ? 1 : 0
      
      if (slotPriority > scorePriority && score < 7) {
        setWarning({
          message: `系统警告：资源错配。您正在将高净值时间分配给低优先级资产 [${draggedSkill}] (Score: ${score.toFixed(1)})`,
          slotId
        })
      }
    }
    
    setDraggedSkill(null)
  }

  const handleSlotChange = (moduleId, slotId, newValue) => {
    const module = matrix.find(m => m.id === moduleId)
    const slot = module?.slots.find(s => s.id === slotId)
    
    if (slot) {
      const blockedBy = checkCriticalBlock(slot.type)
      if (blockedBy && newValue) {
        setInterruptModal({
          skill: newValue,
          defense: blockedBy,
          slotId,
          moduleId,
        })
        return
      }
    }

    setMatrix(matrix.map(m => {
      if (m.id === moduleId) {
        return {
          ...m,
          slots: m.slots.map(s => 
            s.id === slotId ? { ...s, assigned: newValue || null } : s
          )
        }
      }
      return m
    }))
  }

  const confirmAndDismiss = () => {
    if (interruptModal) {
      setInterruptModal(null)
    }
  }

  const autoSuggest = () => {
    const sortedSkills = [...skills].sort((a, b) => {
      const scoreA = calculateScore(a.beta, a.alpha, a.substitutability)
      const scoreB = calculateScore(b.beta, b.alpha, b.substitutability)
      return scoreB - scoreA
    })
    
    const suggestions = sortedSkills.slice(0, 4).map((s, i) => ({
      skill: s.name,
      score: calculateScore(s.beta, s.alpha, s.substitutability),
      recommendedSlot: i === 0 ? '周六核心时段 (4h)' : 
                       i === 1 ? '晚间高压流 (60m)' :
                       i === 2 ? '通勤碎片 (40m)' : '视情况外包'
    }))
    
    return suggestions
  }

  const suggestions = autoSuggest()
  
  const daemonDefenses = defenses.filter(d => d.patchType === 'daemon' && !d.status)
  const criticalL5 = defenses.filter(d => d.lethality === 5 && !d.status)

  return (
    <div className="space-y-4">
      {interruptModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-terminal-card border-2 border-terminal-red p-6 max-w-lg mx-4 animate-pulse">
            <div className="flex items-center gap-3 mb-4">
              <AlertOctagon className="w-8 h-8 text-terminal-red" />
              <h3 className="text-xl font-bold text-terminal-red">系统拦截 (OVERRIDE)</h3>
            </div>
            <div className="bg-terminal-red/20 border border-terminal-red p-4 font-mono text-sm mb-4">
              <p className="text-terminal-red mb-2">CRITICAL FAILURE DETECTED:</p>
              <p className="text-mono-200">
                检测到致命底层漏洞未修复：
              </p>
              <p className="text-terminal-orange font-bold mt-2">
                ► {interruptModal.defense.name} (L{interruptModal.defense.lethality})
              </p>
              <p className="text-mono-300 mt-2">
                在桶底破洞被堵住之前，禁止向系统注入更多高阶算力。
              </p>
            </div>
            <p className="text-mono-200 text-sm mb-4">
              请优先将漏洞分配至 <span className="text-terminal-blue font-bold">System Patch Block</span>
            </p>
            <button
              onClick={confirmAndDismiss}
              className="w-full py-3 bg-terminal-red text-white font-bold hover:bg-terminal-red/80 transition-colors"
            >
              确认拦截 - 立即修复漏洞
            </button>
          </div>
        </div>
      )}

      {daemonDefenses.length > 0 && (
        <div className="bg-mono-800 border border-mono-600 p-3">
          <div className="flex items-center gap-2 mb-2">
            <Server className="w-4 h-4 text-terminal-blue" />
            <span className="text-mono-100 text-sm font-bold">零阶段 - 后台守护进程 (Zero-Phase / 零时间成本自动化)</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {daemonDefenses.map(d => (
              <span key={d.id} className="px-2 py-1 bg-terminal-blue/20 border border-terminal-blue text-terminal-blue text-xs flex items-center gap-1">
                <Server className="w-3 h-3" />
                {d.name}
              </span>
            ))}
          </div>
          <p className="text-mono-400 text-xs mt-2">
            以上不计入 18 小时，但必须融入本能习惯
          </p>
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-terminal-orange" />
          <span className="text-mono-200 text-sm">每周可用时间: 18 小时</span>
          {criticalL5.length > 0 && (
            <span className="px-2 py-0.5 bg-terminal-red text-white text-xs animate-pulse">
              {criticalL5.length} 个致命漏洞未修复
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={resetToDefault}
            className="flex items-center gap-2 px-3 py-1.5 border border-terminal-border text-mono-200 hover:bg-terminal-border transition-colors text-sm"
          >
            <RotateCcw className="w-4 h-4" />
            重置
          </button>
        </div>
      </div>

      {warning && (
        <div className="bg-terminal-warning/20 border border-terminal-warning p-3 flex items-start gap-2">
          <TriangleAlert className="w-5 h-5 text-terminal-warning flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-terminal-warning text-sm font-bold">{warning.message}</p>
          </div>
          <button onClick={() => setWarning(null)} className="text-mono-300 hover:text-mono-100">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="bg-terminal-card border border-terminal-border p-4 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-4 h-4 text-terminal-green" />
          <span className="text-mono-300 text-sm font-bold">智能建议 <span className="text-xs font-normal">AUTO-SUGGEST</span></span>
        </div>
        <div className="space-y-2">
          {suggestions.map((s, idx) => (
            <div key={idx} className="flex items-center justify-between p-2 bg-terminal-bg border border-terminal-border text-sm">
              <div className="flex items-center gap-2">
                <span className="text-terminal-green font-bold">{idx + 1}.</span>
                <span className="text-mono-100">{s.skill}</span>
                <span className="text-mono-300">({s.score.toFixed(1)})</span>
              </div>
              <span className="text-terminal-blue text-xs">{s.recommendedSlot}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4">
        {matrix.map((module) => (
          <div key={module.id} className="bg-terminal-card border border-terminal-border overflow-hidden">
            <div className={`p-3 flex items-center justify-between ${
              module.id === 'PATCH' ? 'bg-terminal-blue/20' :
              module.id === 'D' ? 'bg-terminal-red/20' :
              module.id === 'C' ? 'bg-terminal-green/20' :
              module.id === 'B' ? 'bg-terminal-orange/20' : 'bg-terminal-blue/20'
            }`}>
              <div className="flex items-center gap-2">
                <Activity className={`w-4 h-4 ${
                  module.id === 'PATCH' ? 'text-terminal-blue' :
                  module.id === 'D' ? 'text-terminal-red' :
                  module.id === 'C' ? 'text-terminal-green' :
                  module.id === 'B' ? 'text-terminal-orange' : 'text-terminal-blue'
                }`} />
                <h3 className="font-bold text-mono-100">{module.name}</h3>
              </div>
              <div className="flex items-center gap-3 text-xs text-mono-300">
                <span>{module.schedule}</span>
                <span className="px-2 py-0.5 bg-terminal-bg border border-terminal-border">{module.duration}</span>
              </div>
            </div>
            
            <div className="p-3 space-y-2">
              {module.slots.map((slot) => {
                const score = slot.assigned ? getSkillScore(slot.assigned) : 0
                
                return (
                  <div 
                    key={slot.id}
                    className="flex items-center gap-3 p-3 bg-terminal-bg border border-terminal-border hover:border-mono-400 transition-colors"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => handleDrop(slot.id, slot.assigned, slot.type)}
                  >
                    <div className="w-16 text-xs text-mono-300 font-mono">
                      {slot.days && <span className="block">{slot.days}</span>}
                      {slot.duration}
                    </div>
                    <div className="flex-1">
                      <div className="text-mono-100 text-sm font-medium">{slot.name}</div>
                      {slot.assigned && (
                        <div 
                          className="text-xs mt-1 cursor-move flex items-center gap-1 hover:text-terminal-green"
                          draggable
                          onDragStart={() => handleDragStart(slot.assigned)}
                        >
                          <span className="text-mono-300">当前分配:</span>
                          <span className={getTierInfo(score).text}>{slot.assigned}</span>
                          <span className="text-mono-300">({score.toFixed(1)})</span>
                        </div>
                      )}
                    </div>
                    <select
                      value={slot.assigned || ''}
                      onChange={(e) => handleSlotChange(module.id, slot.id, e.target.value)}
                      className="bg-terminal-card border border-terminal-border text-mono-200 text-xs p-1 focus:border-terminal-green outline-none"
                    >
                      <option value="">-- 选择技能 --</option>
                      {skills.map(s => (
                        <option key={s.id} value={s.name}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-4 bg-terminal-bg border border-terminal-border">
        <div className="flex items-center gap-2 mb-2">
          <Terminal className="w-4 h-4 text-mono-300" />
          <span className="text-mono-300 text-sm font-bold">时间分配汇总 <span className="text-xs font-normal">TIME ALLOCATION SUMMARY</span></span>
        </div>
        <div className="grid grid-cols-4 gap-2 text-xs">
          <div className="p-2 bg-terminal-blue/20 border border-terminal-blue/30">
            <div className="text-terminal-blue font-bold">弹性</div>
            <div className="text-mono-300">Patch Block</div>
          </div>
          <div className="p-2 bg-terminal-blue/20 border border-terminal-blue/30">
            <div className="text-terminal-blue font-bold">400分钟</div>
            <div className="text-mono-300">模块A</div>
          </div>
          <div className="p-2 bg-terminal-orange/20 border border-terminal-orange/30">
            <div className="text-terminal-orange font-bold">450分钟</div>
            <div className="text-mono-300">模块B</div>
          </div>
          <div className="p-2 bg-terminal-green/20 border border-terminal-green/30">
            <div className="text-terminal-green font-bold">600分钟</div>
            <div className="text-mono-300">模块C</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function App() {
  const [activeTab, setActiveTab] = useState('concepts')
  const [skills, setSkills] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SKILLS)
    return saved ? JSON.parse(saved) : DEFAULT_SKILLS
  })
  const [defenses, setDefenses] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DEFENSES)
    return saved ? JSON.parse(saved) : DEFAULT_DEFENSES
  })
  const [matrix, setMatrix] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MATRIX)
    return saved ? JSON.parse(saved) : DEFAULT_MATRIX
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SKILLS, JSON.stringify(skills))
  }, [skills])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DEFENSES, JSON.stringify(defenses))
  }, [defenses])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MATRIX, JSON.stringify(matrix))
  }, [matrix])

  const tabs = [
    { id: 'concepts', label: '核心理念', icon: Brain },
    { id: 'engine', label: '套利引擎', icon: Zap },
    { id: 'matrix', label: '时间矩阵', icon: Clock },
  ]

  const handleBlockAllocation = (skill, defense) => {
    console.log('Blocked:', skill, defense)
  }

  return (
    <AppContext.Provider value={{ skills, defenses, matrix }}>
      <div className="min-h-screen bg-terminal-bg">
        <header className="bg-terminal-card border-b border-terminal-border sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center justify-between h-14">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-terminal-green flex items-center justify-center">
                  <span className="text-white font-bold text-sm">CAS</span>
                </div>
                <div>
                  <h1 className="text-mono-100 font-bold text-sm tracking-wider">CAS ENGINE</h1>
                  <p className="text-mono-300 text-xs">技能套利决策引擎</p>
                </div>
              </div>
              
              <nav className="flex">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-2 text-sm transition-colors relative ${
                        activeTab === tab.id 
                          ? 'text-terminal-green' 
                          : 'text-mono-300 hover:text-mono-100'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="font-medium">{tab.label}</span>
                      {activeTab === tab.id && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-terminal-green"></div>
                      )}
                    </button>
                  )
                })}
              </nav>
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 py-6">
          <div className="mb-4 flex items-center gap-2 text-xs text-mono-300">
            <span className="text-terminal-green">●</span>
            <span>系统在线</span>
            <span className="mx-2">|</span>
            <span>本地存储已激活</span>
            <span className="mx-2">|</span>
            <span>{new Date().toLocaleDateString('zh-CN')}</span>
          </div>

          {activeTab === 'concepts' && <CoreConcepts />}
          {activeTab === 'engine' && (
            <ArbitrageEngine 
              skills={skills} 
              setSkills={setSkills} 
              defenses={defenses}
              setDefenses={setDefenses}
              onBlockAllocation={handleBlockAllocation}
            />
          )}
          {activeTab === 'matrix' && (
            <MatrixPanel 
              matrix={matrix} 
              setMatrix={setMatrix} 
              skills={skills}
              defenses={defenses}
              onBlockAllocation={handleBlockAllocation}
            />
          )}
        </main>
      </div>
    </AppContext.Provider>
  )
}

export default App
