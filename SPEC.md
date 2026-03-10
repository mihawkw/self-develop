# CAS Engine - Technical Specification

## Project Overview
- **Project Name**: CAS Engine (Complex Adaptive System - Skill Arbitrage Matrix)
- **Type**: Single Page Application (SPA)
- **Framework**: React + Vite + Tailwind CSS + Lucide Icons
- **Data Persistence**: LocalStorage
- **Target Users**: High-performance individuals seeking skill arbitrage and time optimization

## UI/UX Specification

### Visual Design
- **Theme**: Dark Mode - Military/Financial Terminal aesthetic
- **Primary Background**: #0a0a0a (near black)
- **Secondary Background**: #111111 (card backgrounds)
- **Border Color**: #222222 (subtle borders)
- **Accent Colors**:
  - Red (T0/Core): #ef4444
  - Orange (T1/Leverage): #f97316
  - Blue (T2/Tactical): #3b82f6
  - Gray (Discard): #6b7280
  - Warning: #eab308
  - Terminal Green: #22c55e
- **Text Colors**:
  - Primary: #ffffff
  - Secondary: #a1a1aa
  - Muted: #71717a

### Typography
- **Font Family**: "JetBrains Mono", "Fira Code", monospace
- **Headings**: Bold, uppercase, letter-spacing-wide
- **Body**: Regular, compact line-height
- **Data Values**: Monospace, high contrast

### Layout
- **Header**: Fixed top navigation with tab switching
- **Content Area**: Full viewport height minus header
- **Cards**: Grid layout with consistent spacing

## Component Specification

### Tab Navigation
- Three tabs: Core Concepts | Arbitrage Engine | 18-Hour Matrix
- Active state: Green underline + bright text
- Inactive state: Muted text
- Hover: Subtle brightness increase

### Panel 1: Core Concepts
Cards displaying:
1. **Skill Acquisition Formula**: E × R - D × T
2. **Four Stages of Skill Evolution**: 拓荒期 -> 高原期 -> 破壁期 -> 大师期
3. **System Defense**: Beta vulnerabilities to outsource

### Panel 2: Arbitrage Engine
- **Skill List**: Scrollable list of skills with parameters
- **Add Skill Form**: Input for skill name + three sliders
- **Sliders**:
  - Beta (β): 0-5, step 0.1
  - Alpha (α): 1-10, step 0.1
  - Substitutability (S): 0.1-0.9, step 0.1
- **Score Calculation**: Priority Score = Beta + (Alpha × (1 - Substitutability))
- **Score Tags**:
  - Score >= 10: T0 Core Engine (Red)
  - Score 7-9.9: T1 Leverage/Defense (Orange)
  - Score 4-6.9: T2 Tactical (Blue)
  - Score < 4: Discard/Outsource (Gray)

### Panel 3: 18-Hour Matrix
- **Modules**:
  - Module A: Fragment/Flow (Weekdays, 80 mins/day)
  - Module B: Evening High-Pressure (Weekdays, 90 mins/day)
  - Module C: Saturday Intensive (10 Hours)
  - Module D: Blackout Sunday (Complete rest)
- **Features**:
  - Reset to Default button
  - Auto-Suggest based on priority
  - Warning alerts for resource mismatch
- **Drag & Drop**: Assign skills to time slots

## State Management
- React hooks (useState, useEffect, useCallback)
- LocalStorage for persistence
- Tab state: activeTab (string)
- Skills state: skills array
- Matrix state: assignedTimeSlots

## Default Data

### Pre-loaded Skills
1. 心理洞察与叙事表达: β=2, α=10, S=0.1 → Score=11.0
2. AI Harness (业务流整合): β=1, α=10, S=0.1 → Score=10.0
3. 广义投资体系: β=3, α=8, S=0.2 → Score=9.4
4. 功能性塑形与游泳: β=1, α=6, S=0.1 → Score=6.4
5. 驾驶与空间导航: β=4, α=3, S=0.5 → Score=5.5
6. 英语 (国内环境): β=1, α=4, S=0.8 → Score=1.8

### Default Time Slots
- Module A (Weekdays 80min):
  - 40min: 导航与物流推演
  - 40min: 心理洞察与叙事脱口秀拆解
- Module B (Weekdays 90min):
  - Mon/Wed/Fri: 45min 功能性塑形/游泳, 45min AI工作流实操
  - Tue/Thu: 60min AI高压心理模拟/叙事实战, 30min 厨艺自娱/投资机械看盘
- Module C (Saturday 10h):
  - 4h: 驾驶实战 / AI深度攻坚
  - 2.5h: AI业务流深度开发
  - 0.5h: 投资系统宏观检视与调仓
  - 3h: 真实社交实测 / 叙事表达与心理干预变现
- Module D (Sunday): Complete blackout

## Acceptance Criteria
1. Three tabs switch correctly
2. Skills can be added, edited, deleted
3. Score calculates correctly and updates in real-time
4. Score tags display with correct colors
5. Matrix shows all time slots
6. Reset to Default works
7. Warning appears for low-priority skills in high-value slots
8. Data persists in LocalStorage
9. UI matches dark terminal aesthetic
