"use client";

import { useMemo, useRef, useState } from "react";

type ModuleId =
  | "home" | "system" | "principles" | "brand" | "foundations" | "common"
  | "components" | "patterns" | "templates" | "hmi" | "mobile" | "web"
  | "resources" | "collaboration" | "governance";

type ModulePage = {
  eyebrow: string;
  title: string;
  lead: string;
  accent: string;
  status?: string;
  items: Array<{ title: string; body: string; meta: string }>;
  noteTitle: string;
  note: string;
};

const navigation: Array<{ group: string; items: Array<{ id: ModuleId; label: string }> }> = [
  { group: "概览", items: [{ id: "home", label: "首页" }, { id: "system", label: "系统总则" }, { id: "principles", label: "设计原则" }] },
  { group: "设计语言", items: [{ id: "brand", label: "品牌规范" }, { id: "foundations", label: "设计基础" }, { id: "common", label: "通用体验规范" }] },
  { group: "构建体验", items: [{ id: "components", label: "组件" }, { id: "patterns", label: "交互模式" }, { id: "templates", label: "页面模板" }] },
  { group: "终端", items: [{ id: "hmi", label: "智能座舱 HMI" }, { id: "mobile", label: "Mobile App" }, { id: "web", label: "Web / PC" }] },
  { group: "交付与管理", items: [{ id: "resources", label: "设计资源" }, { id: "collaboration", label: "授权与协作" }, { id: "governance", label: "管理与治理" }] },
];

const modulePages: Record<Exclude<ModuleId, "home">, ModulePage> = {
  system: {
    eyebrow: "01 · SYSTEM DEFINITION", title: "系统总则", accent: "#0878e6", status: "Stable 1.0",
    lead: "建立 Design System 的共同认知、适用边界和使用方式，让不同角色在同一套结构中高效协作。",
    items: [
      { title: "项目介绍", meta: "01.1", body: "说明建设背景、愿景目标、目标用户，以及规范与品牌、业务之间的关系。" },
      { title: "系统架构", meta: "01.2", body: "定义集团公共规范、终端专项规范与组件、模式、模板之间的继承关系。" },
      { title: "使用说明", meta: "01.3", body: "为品牌运营、产品、设计和研发提供查找、接入、迁移与验收路径。" },
      { title: "术语表", meta: "01.4", body: "统一 Token、Component、Pattern、Template、Variant 与 State 等核心概念。" },
    ], noteTitle: "适用范围", note: "面向集团品牌运营、产品经理、体验设计师与研发团队，覆盖智能座舱 HMI、Mobile App 和 Web / PC。",
  },
  principles: {
    eyebrow: "02 · EXPERIENCE PRINCIPLES", title: "设计原则", accent: "#18a66a",
    lead: "七条跨品牌、产品和终端的最高层判断标准，在目标或方案冲突时帮助团队做出一致决策。",
    items: [
      { title: "安全可信", meta: "PRINCIPLE 01", body: "驾驶安全、隐私与关键任务优先于表现力和效率。" },
      { title: "清晰可达", meta: "PRINCIPLE 02", body: "信息准确、层级清楚，并在不同环境与能力条件下易读易用。" },
      { title: "一致可预期", meta: "PRINCIPLE 03", body: "跨产品、车型和终端保持稳定认知，同时允许场景适配。" },
      { title: "高效且场景智能", meta: "PRINCIPLE 04", body: "缩短高频路径，并基于用户与设备状态提供恰当帮助。" },
      { title: "多模态且用户可控", meta: "PRINCIPLE 05", body: "视觉、声音、触觉、语音与实体控制协同，主动能力可撤销。" },
      { title: "差异有边界", meta: "PRINCIPLE 06", body: "以统一基础承载品牌和产品差异，形成可识别的体验。" },
      { title: "包容并持续演进", meta: "PRINCIPLE 07", body: "支持无障碍、国际化与个体差异，并通过验证持续改进。" },
    ], noteTitle: "使用方式", note: "每项原则都应包含定义、价值、适用场景、正反案例和设计冲突判断方法。",
  },
  brand: {
    eyebrow: "03 · BRAND", title: "品牌规范", accent: "#ef3f6b",
    lead: "将品牌理念转化为可执行的视觉、内容与体验表达，并明确集团默认与受控差异化的边界。",
    items: [
      { title: "品牌基础", meta: "03.1", body: "品牌理念、关键词、个性与产品体验调性的共同基线。" },
      { title: "Logo", meta: "03.2", body: "标准形式、安全区域、最小尺寸、组合方式与禁止用法。" },
      { title: "品牌色彩", meta: "03.3", body: "品牌色、辅助色、中性色、功能色与多终端应用原则。" },
      { title: "图像语言", meta: "03.4", body: "摄影、插画、3D 图形与产品渲染的统一视觉风格。" },
      { title: "品牌语气", meta: "03.5", body: "定义产品文案与营销表达的语气、措辞和场景差异。" },
      { title: "人格与差异化", meta: "03.6", body: "明确品牌默认、授权定制、用户个性化和禁止覆盖项。" },
    ], noteTitle: "控制原则", note: "品牌表达可以变化，但不能覆盖驾驶安全、基础可用性、核心导航与状态语义等必须统一项。",
  },
  foundations: {
    eyebrow: "04 · FOUNDATIONS", title: "设计基础", accent: "#695cff",
    lead: "用原始值、语义角色、组件映射与多模式机制，建立跨终端可复用的底层设计语言。",
    items: [
      { title: "色彩 Color", meta: "04.1", body: "管理品牌色、中性色、功能色、语义色与主题模式。" },
      { title: "排版 Typography", meta: "04.2", body: "定义字体、字号、字重、行高、数字与多语言排版。" },
      { title: "布局 Layout", meta: "04.3", body: "统一网格、间距、层级、响应式与空间布局规则。" },
      { title: "形状与材质", meta: "04.4", body: "建立圆角、边框、阴影、模糊和表面层级语义。" },
      { title: "图标与动效", meta: "04.5", body: "规范图形语言、状态过渡、反馈节奏与减少动态模式。" },
      { title: "设计令牌", meta: "04.6", body: "通过 Primitive、Semantic、Component 与 Mode 管理差异。" },
    ], noteTitle: "Token 架构", note: "Primitive Tokens → Semantic Tokens → Component Tokens → Platform / Brand Modes。",
  },
  common: {
    eyebrow: "05 · COMMON EXPERIENCE", title: "通用体验规范", accent: "#00a0a8",
    lead: "沉淀跨组件与终端都应遵循的基础体验规则，让反馈、内容、隐私与包容性保持一致。",
    items: [
      { title: "无障碍", meta: "ACCESSIBILITY", body: "覆盖视觉、听觉、认知和运动能力差异与辅助技术支持。" },
      { title: "内容与文案", meta: "CONTENT", body: "定义命名、语气、提示、错误信息与多语言内容规则。" },
      { title: "状态与反馈", meta: "FEEDBACK", body: "统一加载、成功、警告、错误与离线状态的表达。" },
      { title: "隐私与权限", meta: "PRIVACY", body: "以透明、最小必要和用户可控为原则设计授权体验。" },
      { title: "国际化", meta: "LOCALIZATION", body: "支持文本扩展、RTL、单位、日期时间与本地文化差异。" },
      { title: "数据可视化", meta: "DATA", body: "规范图表选择、颜色、标注、交互和无障碍替代信息。" },
    ], noteTitle: "跨终端继承", note: "通用规则默认由所有终端继承；仅当使用环境、输入方式或系统能力不同，才在终端规范中补充。",
  },
  components: {
    eyebrow: "06 · COMPONENTS", title: "组件", accent: "#ff7849",
    lead: "定义可独立复用的界面单元，并明确 Anatomy、Variant、State、Behavior 与平台适配。",
    items: [
      { title: "内容", meta: "CONTENT", body: "头像、徽标、卡片、列表、媒体和数据展示组件。" },
      { title: "布局与组织", meta: "LAYOUT", body: "容器、分隔、栅格、滚动区域与信息组织组件。" },
      { title: "菜单与操作", meta: "ACTIONS", body: "按钮、菜单、工具栏、快捷操作与上下文操作。" },
      { title: "导航与搜索", meta: "NAVIGATION", body: "侧栏、标签栏、面包屑、分页、搜索和筛选。" },
      { title: "呈现", meta: "PRESENTATION", body: "弹窗、浮层、抽屉、提示气泡与全屏呈现。" },
      { title: "选择与输入", meta: "INPUT", body: "文本输入、选择器、开关、滑杆与表单控件。" },
      { title: "状态", meta: "STATUS", body: "进度、加载、通知、空状态、错误和系统状态。" },
    ], noteTitle: "组件页面标准", note: "每个组件需包含用途、构成、规格、行为、状态、无障碍、正确与错误用法，以及终端差异。",
  },
  patterns: {
    eyebrow: "07 · PATTERNS", title: "交互模式", accent: "#18a66a",
    lead: "为跨多个组件的任务、反馈与流程提供稳定方案，回答一个完整用户目标应该如何实现。",
    items: [
      { title: "进入与引导", meta: "ONBOARDING", body: "首次使用、功能发现、渐进披露与上下文教育。" },
      { title: "搜索与筛选", meta: "SEARCH", body: "查询、联想、范围选择、结果呈现与无结果恢复。" },
      { title: "输入与表单", meta: "DATA ENTRY", body: "字段组织、即时验证、错误恢复与任务完成反馈。" },
      { title: "反馈与确认", meta: "FEEDBACK", body: "成功、警告、破坏性操作确认与撤销机制。" },
      { title: "加载与等待", meta: "LOADING", body: "即时响应、进度预期、骨架状态与后台任务。" },
      { title: "设置与个性化", meta: "SETTINGS", body: "偏好组织、默认值、跨设备同步与恢复。" },
    ], noteTitle: "与组件的区别", note: "组件是可复用界面单元；Pattern 描述多个组件如何协同完成一个任务或处理一种体验状态。",
  },
  templates: {
    eyebrow: "08 · TEMPLATES", title: "页面模板", accent: "#8a5cf5",
    lead: "将高频、稳定的页面骨架沉淀为模板，缩短设计路径，同时保留业务内容与品牌表达空间。",
    items: [
      { title: "主页与启动页", meta: "HOME", body: "品牌入口、核心任务、个性化内容与状态概览。" },
      { title: "列表与详情", meta: "LIST–DETAIL", body: "跨尺寸的内容浏览、选择、详情与多窗格适配。" },
      { title: "搜索结果", meta: "SEARCH", body: "查询条件、筛选排序、结果列表与空状态骨架。" },
      { title: "设置中心", meta: "SETTINGS", body: "分组导航、偏好编辑、说明与危险操作区域。" },
      { title: "任务流程", meta: "FLOW", body: "分步任务、状态保存、确认、完成与异常恢复。" },
      { title: "数据看板", meta: "DASHBOARD", body: "关键指标、趋势、异常、下钻与跨设备布局。" },
    ], noteTitle: "模板边界", note: "Template 规定稳定骨架而非具体业务页面；业务差异应通过内容、组件组合和开放区域实现。",
  },
  hmi: {
    eyebrow: "09 · HMI", title: "智能座舱 HMI", accent: "#147bd1",
    lead: "面向驾驶与驻车环境定义注意力、安全、多模态输入和车载系统能力，是首期验证的核心终端。",
    items: [
      { title: "驾驶安全", meta: "SAFETY", body: "分心控制、任务锁定、 glanceability 与紧急状态优先级。" },
      { title: "屏幕与区域", meta: "DISPLAY", body: "中控、仪表、HUD、后排与多屏连续体验。" },
      { title: "多模态交互", meta: "MULTIMODAL", body: "触控、语音、方向盘、实体控制、声音与触觉协同。" },
      { title: "车载导航", meta: "NAVIGATION", body: "Launcher、全局导航、快捷入口与任务恢复。" },
      { title: "行车状态", meta: "VEHICLE STATE", body: "车辆、驾驶、能源、告警与系统状态的语义表达。" },
      { title: "场景与个性化", meta: "CONTEXT", body: "基于驾驶、驻车、座舱位置和用户状态提供适配。" },
    ], noteTitle: "必须统一", note: "驾驶安全、关键告警、核心状态语义、最小触控目标和基础导航行为必须遵守集团级规则。",
  },
  mobile: {
    eyebrow: "10 · MOBILE APP", title: "Mobile App", accent: "#6b63ff",
    lead: "在集团公共语言上适配触屏、单手操作、系统权限与移动场景，连接车辆、服务和用户生活。",
    items: [
      { title: "导航结构", meta: "NAVIGATION", body: "底部导航、层级推进、深层链接与任务恢复。" },
      { title: "触控与手势", meta: "TOUCH", body: "目标尺寸、单手可达、滚动、拖动与系统手势边界。" },
      { title: "账号与设备", meta: "ACCOUNT", body: "登录、授权、设备绑定、家庭共享与安全验证。" },
      { title: "车辆远程控制", meta: "REMOTE", body: "状态新鲜度、命令确认、等待、失败与风险提示。" },
      { title: "通知与实时状态", meta: "LIVE", body: "推送、活动状态、桌面小组件与中断管理。" },
      { title: "离线与弱网", meta: "OFFLINE", body: "缓存、同步、冲突处理与网络恢复反馈。" },
    ], noteTitle: "平台一致性", note: "优先遵循 iOS 与 Android 的系统习惯，再以集团 Token、内容语言和业务模式建立品牌一致性。",
  },
  web: {
    eyebrow: "11 · WEB / PC", title: "Web / PC", accent: "#00a3c7",
    lead: "面向宽屏、键鼠、复杂数据与高密度任务，建立响应式、可访问和高效率的桌面体验。",
    items: [
      { title: "响应式布局", meta: "RESPONSIVE", body: "断点、容器、栅格、多栏与密度模式。" },
      { title: "键盘与焦点", meta: "KEYBOARD", body: "焦点顺序、快捷键、跳转链接与可见焦点。" },
      { title: "导航与工作区", meta: "WORKSPACE", body: "全局导航、侧栏、标签、多任务与页面状态。" },
      { title: "表格与数据", meta: "DATA", body: "高密度表格、筛选、排序、批量操作与导出。" },
      { title: "表单与管理任务", meta: "FORMS", body: "长表单、权限管理、草稿、校验与审计记录。" },
      { title: "跨浏览器与性能", meta: "QUALITY", body: "兼容范围、加载策略、稳定性与渐进增强。" },
    ], noteTitle: "效率优先", note: "Web / PC 在保持清晰和无障碍的前提下，可通过更高信息密度与键盘操作提升专业任务效率。",
  },
  resources: {
    eyebrow: "12 · RESOURCES", title: "设计资源", accent: "#e87518",
    lead: "把规范转化为可复用、可检查和可交付的资产，连接文档、设计工具与研发实现。",
    items: [
      { title: "Figma Libraries", meta: "DESIGN", body: "Variables、Styles、Components、Patterns 与 Templates。" },
      { title: "Token 数据", meta: "TOKENS", body: "语义化 Token 的命名、模式、导出与版本包。" },
      { title: "图标与媒体", meta: "ASSETS", body: "图标、插画、动效、声音和品牌媒体资源。" },
      { title: "检查清单", meta: "CHECKLISTS", body: "设计评审、无障碍、终端适配和发布前检查。" },
      { title: "代码资源", meta: "CODE", body: "后续组件实现、示例、接口说明与可用性状态。" },
      { title: "迁移工具", meta: "MIGRATION", body: "旧版本资产映射、替换建议与迁移验证。" },
    ], noteTitle: "交付链路", note: "原则与规则 → Foundation Tokens → Components → Patterns → Templates → 终端实例 → 检查与发布。",
  },
  collaboration: {
    eyebrow: "AUTHORIZED DELIVERY", title: "授权与协作", accent: "#3176d4",
    lead: "集团守住公共基线，授权实施方负责真实产品需求、设计、研发与验证，双方通过评审和贡献机制持续演进。",
    items: [
      { title: "集团公共基线", meta: "STEP 01", body: "定义必须统一项、品牌默认、开放扩展点、设计资源与验收标准。" },
      { title: "本地需求归纳", meta: "STEP 02", body: "结合市场、车型、业务与技术条件明确本地需求和差异。" },
      { title: "设计研发落地", meta: "STEP 03", body: "产品、设计与研发团队共同完成方案、开发、验证和交付。" },
      { title: "成果评审回流", meta: "STEP 04", body: "差异项接受评审，可复用成果与验证结论回流公共体系。" },
    ], noteTitle: "责任边界", note: "集团负责公共规范、开放边界和最终差异评审；授权实施方对本地需求、体验设计、研发实现和验证结果负责。",
  },
  governance: {
    eyebrow: "13 · GOVERNANCE", title: "管理与治理", accent: "#59616d",
    lead: "通过贡献、评审、版本、发布和质量机制，让 Design System 保持可信、可追溯并持续演进。",
    items: [
      { title: "组织与职责", meta: "OWNERSHIP", body: "明确核心团队、领域负责人、实施方和评审者的责任。" },
      { title: "贡献流程", meta: "CONTRIBUTION", body: "从提案、设计、验证、评审到合并与发布的完整路径。" },
      { title: "版本策略", meta: "VERSIONING", body: "Stable、Beta、Deprecated 状态与 Major、Minor、Patch 规则。" },
      { title: "发布与变更记录", meta: "RELEASE", body: "同步文档、设计资源、迁移说明和网站更新状态。" },
      { title: "质量与度量", meta: "QUALITY", body: "采用率、一致性、无障碍、效率与用户体验指标。" },
      { title: "废弃与迁移", meta: "DEPRECATION", body: "预告周期、替代方案、兼容映射与迁移验收。" },
    ], noteTitle: "网站同步状态", note: "当前网站内容与现行框架保持一致；框架后续更新但网站未同步时，版本标签将显示“待更新”。",
  },
};

const updates = [
  { meta: "NEW · HMI", title: "驾驶分心控制", body: "建立行驶与驻车状态下的任务边界、信息优先级与交互约束。", className: "update-safety", art: "safety", target: "hmi" as ModuleId },
  { meta: "UPDATED · FOUNDATIONS", title: "日间与夜间模式", body: "以语义令牌统一不同光照环境下的可读性、对比度与品牌表达。", className: "update-theme", art: "theme", target: "foundations" as ModuleId },
  { meta: "NEW · COMPONENTS", title: "多模态反馈", body: "协调视觉、声音、触觉与语音反馈，让系统状态始终清晰可感知。", className: "update-signal", art: "signal", target: "components" as ModuleId },
];

const homeTopics: Array<{ id: ModuleId; title: string; meta: string; body: string; accent: string; icon: string }> = [
  { id: "system", title: "开始使用", meta: "Getting started", body: "了解系统定位、核心原则与不同角色的接入路径。", accent: "#00a3ff", icon: "start" },
  { id: "foundations", title: "设计基础", meta: "Foundations", body: "用统一的色彩、字体、布局、动效与令牌构建一致体验。", accent: "#695cff", icon: "foundation" },
  { id: "components", title: "组件", meta: "Components", body: "了解可复用界面单元的构成、状态、行为与跨终端适配。", accent: "#ff7a45", icon: "components" },
  { id: "patterns", title: "交互模式", meta: "Patterns", body: "为搜索、反馈、设置、确认等完整任务提供一致方案。", accent: "#18a66a", icon: "patterns" },
  { id: "hmi", title: "终端规范", meta: "Platforms", body: "在集团公共规则上，适配 HMI、Mobile 与 Web / PC 场景。", accent: "#ee3b6a", icon: "platforms" },
  { id: "resources", title: "资源与治理", meta: "Resources", body: "获取设计资产、检查清单，并了解贡献、发布与迁移机制。", accent: "#8a5cf5", icon: "resources" },
];

function BrandGlyph() {
  return <span className="brand-glyph" aria-hidden="true"><i /><i /><i /></span>;
}

function HomeModule({ onSelect }: { onSelect: (id: ModuleId) => void }) {
  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <div className="eyebrow-row"><span>GROUP DESIGN LANGUAGE</span><span className="status-dot">当前稳定版</span></div>
        <h1 id="hero-title">Design System</h1>
        <p className="hero-lead">一套面向集团及授权实施方的设计指导与规范体系，为多品牌、多产品和多终端建立共同基线，并支持子公司与合作公司在清晰边界内完成产品迭代。</p>
        <div className="principle-grid">
          <article className="principle-card"><div className="principle-art principle-art-safe" aria-hidden="true"><span className="safe-orbit" /><span className="safe-core">✓</span></div><div><h2>安全可信</h2><p>优先保障驾驶安全、隐私与关键任务。</p></div></article>
          <article className="principle-card"><div className="principle-art principle-art-clear" aria-hidden="true"><span /><span /><span /></div><div><h2>清晰可达</h2><p>用准确的信息和明确层级降低认知负担。</p></div></article>
          <article className="principle-card"><div className="principle-art principle-art-consistent" aria-hidden="true"><span /><span /><span /></div><div><h2>一致可预期</h2><p>在统一基础上适配不同品牌与真实场景。</p></div></article>
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading"><div><p className="section-kicker">WHAT’S NEW</p><h2>新增与更新</h2></div><p>聚焦当前阶段最重要的规则、终端与组件更新。</p></div>
        <div className="update-grid">
          {updates.map((item) => <button className={`update-card ${item.className}`} onClick={() => onSelect(item.target)} key={item.title}><div className={`update-art update-art-${item.art}`} aria-hidden="true"><i /><b /><span /></div><div className="update-copy"><p>{item.meta}</p><h3>{item.title}</h3><span>{item.body}</span></div></button>)}
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading"><div><p className="section-kicker">EXPLORE</p><h2>浏览主题</h2></div><p>从原则到资源，按工作任务快速进入对应规范模块。</p></div>
        <div className="topic-grid">
          {homeTopics.map((item) => <button className="topic-card" onClick={() => onSelect(item.id)} key={item.id} style={{ "--topic-accent": item.accent } as React.CSSProperties}><div className={`topic-icon topic-icon-${item.icon}`} aria-hidden="true"><i /><b /><span /></div><p>{item.meta}</p><h3>{item.title}</h3><span>{item.body}</span><i className="topic-arrow" aria-hidden="true">→</i></button>)}
        </div>
      </section>

      <section className="platform-section">
        <div className="platform-copy"><p className="section-kicker">ONE SYSTEM · THREE PLATFORMS</p><h2>同一种语言，适配每一种场景。</h2><p>集团公共规则提供一致认知，HMI、Mobile App 与 Web / PC 根据输入方式、环境与任务特征进行受控适配。</p><button className="primary-link" onClick={() => onSelect("hmi")}>探索终端规范 <span>→</span></button></div>
        <div className="device-stage" aria-label="HMI、手机与桌面端界面示意"><div className="device device-hmi"><div className="device-ui"><span /><span /><i /><b /></div></div><div className="device device-phone"><div className="device-ui"><span /><span /><i /><b /></div></div><div className="device device-web"><div className="device-ui"><span /><span /><i /><b /></div></div></div>
      </section>
    </>
  );
}

function DetailModule({ page }: { page: ModulePage }) {
  return (
    <div className="module-page" style={{ "--module-accent": page.accent } as React.CSSProperties}>
      <section className="module-hero">
        <div className="module-breadcrumb"><span>Design System</span><i>›</i><strong>{page.title}</strong></div>
        <div className="module-hero-grid">
          <div><p className="section-kicker">{page.eyebrow}</p><h1>{page.title}</h1><p>{page.lead}</p>{page.status && <span className="module-status">{page.status}</span>}</div>
          <div className="module-visual" aria-hidden="true"><span /><span /><span /><i /></div>
        </div>
      </section>

      <section className="module-content-section">
        <div className="module-section-title"><p className="section-kicker">IN THIS SECTION</p><h2>内容结构</h2></div>
        <div className="module-card-grid">
          {page.items.map((item, index) => (
            <article className="module-card" key={item.title}>
              <div className="module-card-index"><span>{item.meta}</span><i>{String(index + 1).padStart(2, "0")}</i></div>
              <h3>{item.title}</h3><p>{item.body}</p><span className="module-card-arrow" aria-hidden="true">↗</span>
            </article>
          ))}
        </div>
      </section>

      <section className="module-guidance"><div className="guidance-mark" aria-hidden="true">i</div><div><p>{page.noteTitle}</p><h2>{page.note}</h2></div></section>
    </div>
  );
}

export function DesignSystemPage() {
  const [activeModule, setActiveModule] = useState<ModuleId>("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const contentRef = useRef<HTMLElement>(null);

  const allNavItems = useMemo(() => navigation.flatMap((section) => section.items), []);
  const matches = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return [];
    return allNavItems.filter((item) => item.label.toLowerCase().includes(keyword) || (item.id !== "home" && modulePages[item.id].eyebrow.toLowerCase().includes(keyword))).slice(0, 7);
  }, [query, allNavItems]);

  const selectModule = (id: ModuleId) => {
    setActiveModule(id);
    setMenuOpen(false);
    setQuery("");
    requestAnimationFrame(() => contentRef.current?.scrollTo({ top: 0, behavior: "smooth" }));
  };

  const activeLabel = allNavItems.find((item) => item.id === activeModule)?.label ?? "首页";

  return (
    <div className="site-shell">
      <header className="global-header"><div className="global-header-inner">
        <button className="brand brand-button" onClick={() => selectModule("home")} aria-label="Atlas Design System 首页"><BrandGlyph /><span>Atlas</span></button>
        <nav className="global-nav" aria-label="全局导航"><button className="active" onClick={() => selectModule("home")}>设计</button><button onClick={() => selectModule("components")}>开发</button><button onClick={() => selectModule("resources")}>资源</button><button onClick={() => selectModule("collaboration")}>社区</button></nav>
        <div className="header-actions"><button className="header-icon search-shortcut" aria-label="打开搜索" onClick={() => document.getElementById("site-search")?.focus()} /><button className="version-pill" onClick={() => selectModule("governance")}>Stable 1.0</button><button className="menu-toggle" aria-expanded={menuOpen} aria-label="切换目录" onClick={() => setMenuOpen((value) => !value)}><span /><span /></button></div>
      </div></header>

      <div className="doc-header"><div className="doc-header-inner"><button className="doc-title" onClick={() => selectModule("home")}>Design System</button><span className="doc-divider" /><span className="doc-context">{activeLabel}</span></div></div>

      <div className="workspace">
        <aside className={`sidebar ${menuOpen ? "open" : ""}`}><div className="sidebar-inner">
          <div className="search-wrap"><span className="search-icon" aria-hidden="true" /><input id="site-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="筛选规范" aria-label="筛选规范" autoComplete="off" />{query && <div className="search-results" role="listbox">{matches.length ? matches.map((item) => <button key={item.id} onClick={() => selectModule(item.id)}><span>{item.label}</span><small>{item.id === "home" ? "Overview" : modulePages[item.id].eyebrow}</small></button>) : <p>未找到匹配内容</p>}</div>}</div>
          <nav className="sidebar-nav" aria-label="规范目录">{navigation.map((section) => <div className="nav-group" key={section.group}><p>{section.group}</p>{section.items.map((item) => <button key={item.id} className={activeModule === item.id ? "current" : ""} aria-current={activeModule === item.id ? "page" : undefined} onClick={() => selectModule(item.id)}>{item.label}</button>)}</div>)}</nav>
          <div className="sidebar-foot"><span>网站同步状态</span><strong className="sync-status">已更新</strong></div>
        </div></aside>

        {menuOpen && <button className="sidebar-scrim" aria-label="关闭目录" onClick={() => setMenuOpen(false)} />}

        <main className="content" ref={contentRef} tabIndex={-1} aria-live="polite">
          <div key={activeModule} className="module-view">{activeModule === "home" ? <HomeModule onSelect={selectModule} /> : <DetailModule page={modulePages[activeModule]} />}</div>
          <footer><div className="footer-brand"><BrandGlyph /><strong>Atlas Design System</strong></div><div className="footer-meta"><span>Stable 1.0</span><span>最后更新 2026.08.06</span><button onClick={() => contentRef.current?.scrollTo({ top: 0, behavior: "smooth" })}>返回顶部 ↑</button></div><p>以当前稳定版本作为集团与授权实施方开展体验设计、研发落地、验证和持续演进的共同基线。</p></footer>
        </main>
      </div>
    </div>
  );
}
