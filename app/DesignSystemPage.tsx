"use client";

import { useMemo, useRef, useState } from "react";

type ModuleId = string;
type ContentItem = { title: string; body: string; meta: string };
type NavNode = { id: ModuleId; label: string; body?: string; accent?: string; children?: NavNode[] };
type ModulePage = {
  eyebrow: string;
  title: string;
  lead: string;
  accent: string;
  status?: string;
  items: ContentItem[];
  noteTitle: string;
  note: string;
};

const item = (meta: string, title: string, body: string): ContentItem => ({ meta, title, body });

const componentDescriptions = [
  ["5.1", "Button", "用于触发操作或提交指令。"],
  ["5.2", "Dialog", "用于呈现需要用户关注或确认的模态内容。"],
  ["5.3", "Toast", "用于提供简短、即时的操作反馈。"],
  ["5.4", "OSD", "用于临时呈现系统状态或操作结果。"],
  ["5.5", "Slider", "用于在连续范围内选择或调整数值。"],
  ["5.6", "Tab", "用于在同级内容之间进行切换。"],
  ["5.7", "Dock", "用于集中承载常用功能入口。"],
  ["5.8", "Status Bar", "用于呈现系统级状态信息。"],
  ["5.9", "卡片", "用于组织和展示一组相关内容或操作。"],
  ["5.10", "Panel", "用于承载具有独立功能的界面区域。"],
  ["5.11", "Image", "用于展示图片或视觉内容。"],
  ["5.12", "Loading", "用于反馈内容或任务正在加载。"],
  ["5.13", "List", "用于按顺序组织和展示重复内容。"],
  ["5.14", "Divider", "用于分隔不同内容区域。"],
  ["5.15", "进度条", "用于展示任务或流程的完成进度。"],
  ["5.16", "Input Box", "用于输入单行或简短文本内容。"],
  ["5.17", "Input Fields", "用于组织一个或多个信息输入字段。"],
  ["5.18", "Radio Button", "用于在互斥选项中选择一项。"],
  ["5.19", "Check Box", "用于选择一个或多个独立选项。"],
  ["5.20", "Switch", "用于开启或关闭某项设置。"],
] as const;

function componentPage(code: string, title: string, description: string): ModulePage {
  return {
    eyebrow: `${code} · COMPONENT`, title, lead: description, accent: "#ff7849",
    items: [
      item("OVERVIEW", "用途与适用场景", `明确 ${title} 解决的问题、适用范围及不建议使用的情形。`),
      item("ANATOMY", "结构与变体", `定义 ${title} 的组成区域、内容规则、尺寸与可用变体。`),
      item("BEHAVIOR", "状态与行为", `说明默认、聚焦、按下、禁用、加载与异常等状态及反馈。`),
      item("GUIDANCE", "使用规范", "覆盖布局、文案、无障碍、正确与错误用法，以及不同屏幕的适配。"),
    ],
    noteTitle: "组件规范", note: "组件页面将统一采用用途、结构、变体、状态、行为、无障碍和终端适配的说明框架。",
  };
}

const modulePages: Record<ModuleId, ModulePage> = {
  overview: {
    eyebrow: "1 · OVERVIEW", title: "Design System 框架结构", accent: "#0878e6", status: "网站已同步",
    lead: "介绍 Design System 的定位、范围与整体内容，并以七个一级栏目组织设计原则、语言、模式、组件和资源。",
    items: [
      item("2", "设计原则", "定义各类产品与平台的设计原则。"),
      item("3", "设计语言", "定义 Design System 的统一感知与交互表达。"),
      item("4", "设计模式", "沉淀常见场景下可复用的设计解决方案。"),
      item("5", "设计组件", "收录可复用的界面组件及其使用规范。"),
      item("6", "设计资源", "集中管理支持设计和开发工作的资源。"),
      item("7", "其他", "收录术语、命名和更新日志等支持性内容。"),
    ], noteTitle: "当前重点", note: "现阶段框架重点展开 HMI 的系统结构、交互、功能模式、核心视觉元素与基础组件。",
  },
  "principle-general": {
    eyebrow: "2.1 · DESIGN PRINCIPLES", title: "设计原则", accent: "#18a66a",
    lead: "沉淀整体设计工作遵循的基础原则，并指导不同产品与平台在统一和差异之间保持协同。",
    items: [item("2.1.1", "协同差异", "指导不同产品与平台在统一和差异之间保持协同。")],
    noteTitle: "适用范围", note: "通用原则为 HMI、APP 与 Web 的平台原则提供共同判断基线。",
  },
  "principle-hmi": {
    eyebrow: "2.2 · HMI DESIGN", title: "HMI 设计", accent: "#147bd1",
    lead: "定义 HMI 产品在驾驶安全、信息呈现、输入方式和多屏协同方面的设计原则。",
    items: [
      item("SAFETY", "安全优先", "驾驶任务、告警和关键状态优先于表现力与非必要操作。"),
      item("GLANCEABILITY", "一瞥可读", "在有限注意力与动态环境中保持信息清晰、简洁和可感知。"),
      item("MULTIMODAL", "多模态协同", "协调视觉、语音、触控、声音与实体控制。"),
      item("CONTEXT", "场景适配", "根据行驶、驻车、座位和车辆状态提供适当体验。"),
    ], noteTitle: "设计约束", note: "HMI 原则需要贯穿后续 HMI 构成、系统框架、语音体系、功能模式与车外 HMI。",
  },
  "principle-app": {
    eyebrow: "2.3 · APP DESIGN", title: "APP 设计", accent: "#6b63ff",
    lead: "定义 APP 产品在移动场景、触控操作、系统能力和跨设备连续性方面的设计原则。",
    items: [
      item("MOBILE", "移动优先", "围绕碎片化时间、单手操作和变化的网络环境组织体验。"),
      item("PLATFORM", "尊重平台", "遵循移动操作系统的导航、权限和交互习惯。"),
      item("CONTINUITY", "服务连续", "在手机、车辆与账号之间保持任务和状态连续。"),
    ], noteTitle: "继承关系", note: "APP 设计继承通用设计原则与设计语言，并结合移动平台能力进行适配。",
  },
  "principle-web": {
    eyebrow: "2.4 · WEB DESIGN", title: "Web 设计", accent: "#00a3c7",
    lead: "定义 Web 产品在响应式布局、键鼠操作、信息密度和无障碍方面的设计原则。",
    items: [
      item("RESPONSIVE", "响应式", "在不同窗口与屏幕尺寸下保持结构清晰和任务连续。"),
      item("EFFICIENCY", "高效操作", "支持键盘、鼠标、快捷操作和高密度专业任务。"),
      item("ACCESSIBLE", "开放可达", "遵循 Web 标准并支持辅助技术与多种输入方式。"),
    ], noteTitle: "平台适配", note: "Web 设计在共享品牌语言的同时，优先保障浏览器兼容、可访问性和操作效率。",
  },
  "language-brand": {
    eyebrow: "3.1 · BRAND", title: "品牌规范", accent: "#ef3f6b",
    lead: "定义品牌形象及其一致性使用要求。",
    items: [item("IDENTITY", "品牌识别", "规范品牌标志、识别元素与组合关系。"), item("APPLICATION", "应用规则", "定义品牌在数字界面与不同终端中的使用方式。"), item("CONSISTENCY", "一致性要求", "明确正确用法、限制条件与禁止用法。")],
    noteTitle: "品牌一致性", note: "品牌表达应与字体、色彩、图标、声音、动效和核心视觉元素共同形成完整体验。",
  },
  "language-type": {
    eyebrow: "3.2 · TYPOGRAPHY", title: "字体", accent: "#0878e6",
    lead: "定义字体选择、层级和排版规则。",
    items: [item("FONT", "字体选择", "定义品牌字体、系统字体与多语言回退策略。"), item("HIERARCHY", "信息层级", "规范字号、字重、行高与标题正文关系。"), item("LAYOUT", "排版规则", "定义对齐、换行、数字和特殊场景排版。")],
    noteTitle: "可读性", note: "字体规范需要适配 HMI 的一瞥阅读、APP 的移动阅读和 Web 的高密度信息。",
  },
  "language-color": {
    eyebrow: "3.3 · COLOR", title: "色彩", accent: "#695cff",
    lead: "定义色彩体系、语义和使用规则。",
    items: [item("PALETTE", "基础色板", "建立品牌色、中性色和功能色范围。"), item("SEMANTIC", "语义色", "定义文本、背景、边框、状态与告警颜色。"), item("MODE", "模式适配", "管理深浅主题、终端和环境差异。")],
    noteTitle: "语义优先", note: "颜色应通过语义角色使用，避免页面与业务直接绑定原始色值。",
  },
  "language-icons": {
    eyebrow: "3.4 · ICONS", title: "图标", accent: "#8a5cf5",
    lead: "定义不同类别图标的视觉和使用规范。",
    items: [item("3.4.1", "通用基础图标", "承载跨场景复用的基础功能表达。"), item("3.4.2", "驾驶图标", "承载驾驶相关功能与状态表达。"), item("3.4.3", "车控图标", "承载车辆控制相关功能与状态表达。"), item("3.4.4", "拓展图标", "收录基础类别以外的扩展图标。")],
    noteTitle: "图标体系", note: "各类别共享基本视觉语言，并根据驾驶安全、功能语义和识别距离设置专用规则。",
  },
  "language-visual": {
    eyebrow: "3.5 · VISUAL STYLES", title: "通用视觉样式", accent: "#e87518",
    lead: "定义界面中可复用的基础视觉表现。",
    items: [item("3.5.1", "形状", "定义基础形态及其应用方式。"), item("3.5.2", "投影", "定义层级、悬浮和空间关系的阴影表现。"), item("3.5.3", "圆角", "定义界面元素的圆角规格。"), item("3.5.4", "间距", "定义元素之间的空间关系。"), item("3.5.5", "网格", "定义页面布局和内容对齐规则。")],
    noteTitle: "基础样式", note: "通用视觉样式为不同组件、页面和终端提供一致的构成规则。",
  },
  "language-interaction": {
    eyebrow: "3.6 · INTERACTION", title: "交互方式", accent: "#18a66a",
    lead: "定义用户与系统进行操作和反馈的主要方式。",
    items: [item("3.6.1", "GUI", "定义图形用户界面的交互方式。"), item("3.6.2", "语音", "定义语音输入、反馈和交互方式。"), item("3.6.3", "T UI", "定义触控用户界面的交互方式。")],
    noteTitle: "多模态", note: "不同交互方式需要协同工作，并在输入冲突、反馈时序和任务切换中保持一致。",
  },
  "language-sound": { eyebrow: "3.7 · SOUND", title: "声音", accent: "#00a0a8", lead: "定义声音提示、反馈和听觉体验规范。", items: [item("CUE", "提示音", "定义系统状态、操作与告警的听觉提示。"), item("FEEDBACK", "声音反馈", "管理触发条件、优先级、持续时间与打断。"), item("IDENTITY", "声音识别", "建立与品牌及多模态体验一致的听觉语言。")], noteTitle: "听觉安全", note: "声音规范需要控制优先级、音量、频率与重复，避免干扰驾驶和重要信息。" },
  "language-motion": { eyebrow: "3.8 · MOTION", title: "动效", accent: "#8154db", lead: "定义界面运动、转场和动态反馈规则。", items: [item("TRANSITION", "转场", "说明层级、方向和空间关系。"), item("FEEDBACK", "动态反馈", "回应操作、状态变化和任务结果。"), item("TIMING", "节奏与曲线", "统一时长、缓动与连续性。")], noteTitle: "功能优先", note: "动效用于解释变化、反馈状态和建立连续性，不应成为额外负担。" },
  "language-dark": { eyebrow: "3.9 · DARK THEME", title: "深色主题", accent: "#4e5b73", lead: "定义深色界面的视觉适配规则。", items: [item("SURFACE", "表面与层级", "建立深色环境中的背景和容器关系。"), item("CONTRAST", "对比与可读性", "控制文本、图标和状态信息的对比。"), item("ENVIRONMENT", "环境适配", "支持夜间、座舱与显示设备差异。")], noteTitle: "主题映射", note: "深色主题通过语义 Token 映射实现，而不是简单反转颜色。" },
  "language-localization": { eyebrow: "3.10 · LOCALIZATION", title: "国际化 / 本地化", accent: "#19a76d", lead: "定义不同地区和语言环境下的内容与界面适配规则。", items: [item("LANGUAGE", "语言适配", "支持文本扩展、字体回退与双向文字。"), item("LOCALE", "地区格式", "处理日期、时间、数字、单位和地址。"), item("CULTURE", "文化差异", "评估图像、图标、颜色与内容语境。")], noteTitle: "全球一致、本地适配", note: "保持任务结构与品牌认知一致，同时尊重地区规则、语言和文化习惯。" },
  "language-core": {
    eyebrow: "3.11 · CORE VISUALS", title: "核心视觉元素", accent: "#147bd1",
    lead: "定义具有核心识别度的 HMI 视觉元素。",
    items: [item("3.11.1", "车模", "呈现车辆外观、状态和相关信息。"), item("3.11.2", "导航图标", "表达导航相关的位置、方向和状态。"), item("3.11.3", "导航 / 智驾引导线", "呈现导航和智能驾驶的路径引导，包括智驾相关元素和车道引导箭头。"), item("3.11.4", "Home 按键", "定义返回主界面的核心入口。"), item("3.11.5", "Avatar", "定义虚拟形象的视觉表现。"), item("3.11.6", "启动 / P 档", "定义启动及 P 档相关的核心视觉表达。")],
    noteTitle: "HMI 识别度", note: "核心视觉元素承载 HMI 的高频认知和品牌特征，需要与系统框架、3D、语音及驾驶状态协同。",
  },
  "pattern-composition": { eyebrow: "4.1.1 · HMI PATTERNS", title: "HMI 构成", accent: "#147bd1", lead: "定义 HMI 的基本组成、核心原则和屏幕类型。", items: [item("4.1.1.1", "核心原则", "说明 HMI 构成遵循的核心原则。"), item("4.1.1.2", "HUD", "定义抬头显示界面的设计模式。"), item("4.1.1.3", "ABT", "定义 ABT 界面的设计模式。"), item("4.1.1.4", "Co-driver Screen", "定义副驾驶屏界面的设计模式。"), item("4.1.1.5", "Roof Screen", "定义车顶屏界面的设计模式。"), item("4.1.1.6", "Rear Console Screen", "定义后排控制屏界面的设计模式。"), item("4.1.1.7", "Arm Rest Screen", "定义扶手屏界面的设计模式。")], noteTitle: "多屏体系", note: "不同屏幕根据视线位置、使用者、任务和输入方式分工，并保持状态与操作连续。" },
  "pattern-human": { eyebrow: "4.1.2 · HMI PATTERNS", title: "人机交互基础", accent: "#18a66a", lead: "定义 HMI 中人与系统进行交互的基础规则。", items: [item("4.1.2.1", "人机区域", "划分人与界面发生交互的空间区域。"), item("4.1.2.2", "多用户交互", "定义多个用户共同使用系统时的交互方式。")], noteTitle: "座舱协同", note: "需要明确驾驶员、乘员、屏幕、声音区域和实体控制之间的权限与反馈关系。" },
  "pattern-system": { eyebrow: "4.1.3 · HMI PATTERNS", title: "系统框架", accent: "#695cff", lead: "定义 HMI 系统级界面与功能的组织方式。", items: [item("4.1.3.1", "核心布局定义", "定义系统核心界面的布局方式。"), item("4.1.3.2", "层级体系", "定义页面、浮层和信息之间的层级关系。"), item("4.1.3.3", "Launcher", "定义系统启动器的结构与使用方式。"), item("4.1.3.4", "APP 体系", "定义策略和通用 APP 框架。"), item("4.1.3.5", "通知体系", "定义系统通知的类型、层级和呈现方式。"), item("4.1.3.6", "模态化", "定义模态内容的触发、展示和退出方式。"), item("4.1.3.7", "告警体系", "定义告警信息的等级和反馈方式。"), item("4.1.3.8", "APP List", "定义应用列表的结构与展示方式。"), item("4.1.3.9", "功能面板", "组织下拉面板、空调面板等快捷控制入口。"), item("4.1.3.10", "Widget", "定义系统小组件的内容、布局和使用方式。")], noteTitle: "系统骨架", note: "系统框架统一全局布局、层级、导航、通知、告警和功能入口，是 HMI 产品的稳定结构。" },
  "pattern-3d": { eyebrow: "4.1.4 · HMI PATTERNS", title: "3D 体系", accent: "#8a5cf5", lead: "定义 HMI 中三维内容的信息组织与视觉呈现。", items: [item("4.1.4.1", "车模", "定义三维车辆模型的呈现方式。"), item("4.1.4.2", "感知信息", "呈现车辆对环境和对象的感知结果。"), item("4.1.4.3", "地理信息", "呈现道路、位置和环境等地理内容。"), item("4.1.4.4", "功能辅助信息", "呈现辅助理解和操作的三维信息。")], noteTitle: "信息而非装饰", note: "3D 内容应优先服务状态理解、空间关系和功能操作，并控制复杂度与性能。" },
  "pattern-voice": { eyebrow: "4.1.5 · HMI PATTERNS", title: "语音体系", accent: "#00a0a8", lead: "定义语音交互的输入、处理和反馈方式。", items: [item("4.1.5.1", "Avatar", "承载语音助手形象、逻辑状态与阶段变化。"), item("4.1.5.2", "ASR", "定义语音识别过程及结果的呈现方式。"), item("4.1.5.3", "GUI 结果卡片", "呈现语音交互产生的图形化结果。"), item("4.1.5.4", "TTS", "定义语音合成反馈的使用方式。")], noteTitle: "多模态闭环", note: "语音需要与 Avatar、识别文本、GUI 结果、声音和操作状态形成完整反馈闭环。" },
  "pattern-function": { eyebrow: "4.1.6 · HMI PATTERNS", title: "功能模式", accent: "#e87518", lead: "定义特定功能场景下的系统行为和体验模式。", items: [item("4.1.6.1", "展车模式", "定义车辆展示场景下的系统体验。"), item("4.1.6.2", "激活引导", "定义系统或功能首次激活时的引导流程。"), item("4.1.6.3", "开机动画", "定义系统启动过程中的动画表现。"), item("4.1.6.4", "功能引导", "帮助用户理解和使用具体功能。"), item("4.1.6.5", "OOBE", "定义首次使用系统时的初始体验流程。"), item("4.1.6.6", "账号体系", "定义账号登录、身份和个性化体验。"), item("4.1.6.7", "基础驾驶", "定义基础驾驶场景下的界面与交互模式。"), item("4.1.6.8", "辅助影像", "定义车辆辅助影像的展示和操作模式。")], noteTitle: "完整场景", note: "功能模式关注跨组件、跨状态的完整任务体验，并覆盖进入、进行、退出与异常恢复。" },
  "pattern-exterior": { eyebrow: "4.1.7 · HMI PATTERNS", title: "车外 HMI", accent: "#19a76d", lead: "定义车辆外部的人机交互方式。", items: [item("4.1.7.1", "灯光", "通过车外灯光传递车辆状态和意图。"), item("4.1.7.2", "语音交互", "定义车辆外部的语音输入与反馈方式。")], noteTitle: "外部沟通", note: "车外 HMI 需要让行人、乘员和周边交通参与者清晰理解车辆状态与意图。" },
  "resource-components": { eyebrow: "6.1 · RESOURCES", title: "组件库", accent: "#e87518", lead: "提供不同终端可复用的组件资源。", items: [item("6.1.1", "ABT", "提供 ABT 终端的组件资源。"), item("6.1.2", "后排", "提供后排终端的组件资源。"), item("6.1.3", "HUD", "提供 HUD 终端的组件资源。")], noteTitle: "资源交付", note: "组件库应与设计组件规范保持对应，并标明适用终端、版本和使用状态。" },
  "resource-icons": { eyebrow: "6.2 · RESOURCES", title: "图标库", accent: "#8a5cf5", lead: "集中管理和提供统一的图标资源。", items: [item("GENERAL", "通用基础图标", "提供跨场景复用的基础功能图标。"), item("DRIVING", "驾驶与车控图标", "提供驾驶、车辆状态与控制相关图标。"), item("EXTENDED", "扩展图标", "提供业务与终端所需的扩展图标。")], noteTitle: "统一来源", note: "图标库是设计与开发引用图标的唯一资源入口，并与图标规范保持版本同步。" },
  terminology: { eyebrow: "7.1 · OTHER", title: "专用术语表", accent: "#59616d", lead: "统一 Design System 中的专业术语及其解释。", items: [item("PRODUCT", "产品术语", "统一 HMI、APP、Web 和车辆相关概念。"), item("DESIGN", "设计术语", "统一组件、模式、状态、变体和设计语言概念。"), item("TECH", "技术术语", "统一平台、资源、实现与交付相关概念。")], noteTitle: "共同语言", note: "术语表用于减少产品、设计、开发与合作团队之间的理解偏差。" },
  naming: { eyebrow: "7.2 · OTHER", title: "命名规范", accent: "#59616d", lead: "统一文件、资源和设计对象的命名方式。", items: [item("FILES", "文件命名", "定义文档、图片和交付文件的命名规则。"), item("DESIGN", "设计对象", "定义页面、组件、变体、图层和变量命名。"), item("TOKENS", "资源与 Token", "定义图标、组件库和设计 Token 的命名结构。")], noteTitle: "可查找、可维护", note: "命名应稳定、语义清晰、可扩展，并支持跨工具与跨团队协作。" },
  changelog: { eyebrow: "7.3 · OTHER", title: "更新日志", accent: "#59616d", lead: "记录 Design System 的版本和内容变更。", items: [item("2026.08.06", "框架结构重构", "重构七个一级栏目，更新设计原则、语言、模式、组件、资源和其他结构及编号。"), item("WEBSITE", "网站同步", "网站导航与模块内容已同步最新框架结构。")], noteTitle: "同步状态", note: "当前网站已同步最新框架；后续框架更新但网站未同步时，状态标签将显示“待更新”。" },
};

for (const [code, title, description] of componentDescriptions) {
  modulePages[`component-${code.replace(".", "-")}`] = componentPage(code, title, description);
}

const codeId = (code: string) => code.replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-|-$/g, "");
const leaf = (parentId: string, code: string, title: string, body: string, children?: NavNode[]): NavNode => ({ id: `${parentId}--${codeId(code)}`, label: `${code} ${title}`, body, children });
const moduleNode = (id: string, label: string, nested: Record<string, NavNode[]> = {}): NavNode => ({
  id, label, body: modulePages[id].lead, accent: modulePages[id].accent,
  children: modulePages[id].items.filter((entry) => /^\d/.test(entry.meta)).map((entry) => leaf(id, entry.meta, entry.title, entry.body, nested[entry.meta])),
});

const navigation: NavNode[] = [
  { id: "overview", label: "1. overview", body: modulePages.overview.lead, accent: "#0878e6" },
  { id: "section-principles", label: "2. 设计原则", body: "用于定义各类产品与平台的设计原则。", accent: "#18a66a", children: [
    moduleNode("principle-general", "2.1 设计原则"), moduleNode("principle-hmi", "2.2 HMI 设计"), moduleNode("principle-app", "2.3 APP 设计"), moduleNode("principle-web", "2.4 Web 设计"),
  ] },
  { id: "section-language", label: "3. 设计语言", body: "用于定义 Design System 的统一感知与交互表达。", accent: "#695cff", children: [
    moduleNode("language-brand", "3.1 品牌规范"), moduleNode("language-type", "3.2 字体"), moduleNode("language-color", "3.3 色彩"), moduleNode("language-icons", "3.4 图标"), moduleNode("language-visual", "3.5 通用视觉样式"), moduleNode("language-interaction", "3.6 交互方式"), moduleNode("language-sound", "3.7 声音"), moduleNode("language-motion", "3.8 动效"), moduleNode("language-dark", "3.9 深色主题"), moduleNode("language-localization", "3.10 国际化 / 本地化"),
    moduleNode("language-core", "3.11 核心视觉元素", {
      "3.11.3": [leaf("language-core--3-11-3", "3.11.3.1", "智驾相关元素", "用于表达智能驾驶相关状态和信息。"), leaf("language-core--3-11-3", "3.11.3.2", "车道引导箭头", "用于表达车辆与目标路径之间的引导方向。")],
    }),
  ] },
  { id: "section-patterns", label: "4. 设计模式", body: "用于沉淀常见场景下可复用的设计解决方案。", accent: "#00a0a8", children: [
    { id: "patterns-hmi", label: "4.1 HMI", body: "用于组织 HMI 产品中的系统结构、交互和功能模式。", children: [
      moduleNode("pattern-composition", "4.1.1 HMI 构成"), moduleNode("pattern-human", "4.1.2 人机交互基础"),
      moduleNode("pattern-system", "4.1.3 系统框架", {
        "4.1.3.4": [leaf("pattern-system--4-1-3-4", "4.1.3.4.1", "策略", "用于定义 APP 体系的整体设计策略。"), leaf("pattern-system--4-1-3-4", "4.1.3.4.2", "APP 框架", "用于定义 APP 的通用结构框架。")],
        "4.1.3.9": [leaf("pattern-system--4-1-3-9", "4.1.3.9.1", "下拉面板", "用于定义下拉快捷面板的结构和交互。"), leaf("pattern-system--4-1-3-9", "4.1.3.9.2", "空调面板", "用于定义空调控制面板的结构和交互。")],
      }),
      moduleNode("pattern-3d", "4.1.4 3D 体系"), moduleNode("pattern-voice", "4.1.5 语音体系", {
        "4.1.5.1": [leaf("pattern-voice--4-1-5-1", "4.1.5.1.1", "逻辑状态", "用于定义 Avatar 在不同语音阶段的状态变化。")],
      }),
      moduleNode("pattern-function", "4.1.6 功能模式", {
        "4.1.6.6": [leaf("pattern-function--4-1-6-6", "4.1.6.6.1", "个性化", "用于定义与账号关联的个性化体验。")],
      }), moduleNode("pattern-exterior", "4.1.7 车外 HMI"),
    ] },
  ] },
  { id: "section-components", label: "5. 设计组件", body: "用于收录可复用的界面组件及其使用规范。", accent: "#ff7849", children: componentDescriptions.map(([code, title]) => ({ id: `component-${code.replace(".", "-")}`, label: `${code} ${title}`, body: modulePages[`component-${code.replace(".", "-")}`].lead })) },
  { id: "section-resources", label: "6. 设计资源", body: "用于集中管理支持设计和开发工作的资源。", accent: "#e87518", children: [moduleNode("resource-components", "6.1 组件库"), moduleNode("resource-icons", "6.2 图标库")] },
  { id: "section-other", label: "7. 其他", body: "用于收录术语、命名、更新记录等支持性内容。", accent: "#59616d", children: [{ id: "terminology", label: "7.1 专用术语表", body: modulePages.terminology.lead }, { id: "naming", label: "7.2 命名规范", body: modulePages.naming.lead }, { id: "changelog", label: "7.3 更新日志", body: modulePages.changelog.lead }] },
];

const flattenNodes = (nodes: NavNode[]): NavNode[] => nodes.flatMap((node) => [node, ...flattenNodes(node.children ?? [])]);
const allNavItems = flattenNodes(navigation);
const expandableIds = allNavItems.filter((node) => node.children?.length).map((node) => node.id);
const findNodePath = (nodes: NavNode[], id: ModuleId, path: NavNode[] = []): NavNode[] => {
  for (const node of nodes) {
    const nextPath = [...path, node];
    if (node.id === id) return nextPath;
    const childPath = findNodePath(node.children ?? [], id, nextPath);
    if (childPath.length) return childPath;
  }
  return [];
};

function registerNavigationPages(nodes: NavNode[], inheritedAccent = "#0878e6") {
  for (const node of nodes) {
    const accent = node.accent ?? inheritedAccent;
    if (!modulePages[node.id]) {
      const [code, ...titleParts] = node.label.split(" ");
      const title = titleParts.join(" ") || node.label;
      modulePages[node.id] = {
        eyebrow: `${code} · FRAMEWORK`, title, accent, lead: node.body ?? `介绍 ${title} 的定义、范围与使用要求。`,
        items: (node.children ?? []).map((child) => { const [meta, ...parts] = child.label.split(" "); return item(meta, parts.join(" "), child.body ?? `查看 ${parts.join(" ")} 的具体定义与规范。`); }),
        noteTitle: node.children?.length ? "框架层级" : "节点说明", note: node.children?.length ? "本页面汇总直属子级；可通过左侧框架树继续进入任意层级。" : "该节点已作为独立框架内容开放，可在此持续补充具体规范。",
      };
    }
    registerNavigationPages(node.children ?? [], accent);
  }
}
registerNavigationPages(navigation);

function BrandGlyph() { return <span className="brand-glyph" aria-hidden="true"><i /><i /><i /></span>; }
const displayNodeLabel = (label: string) => label.replace(/^\d+(?:\.\d+)*\.?\s*/, "");

function TreeNavItem({ node, depth, activeModule, expanded, onSelect, onToggle }: { node: NavNode; depth: number; activeModule: ModuleId; expanded: Set<ModuleId>; onSelect: (id: ModuleId) => void; onToggle: (id: ModuleId) => void }) {
  const hasChildren = Boolean(node.children?.length);
  const isExpanded = hasChildren && expanded.has(node.id);
  const displayLabel = displayNodeLabel(node.label);
  return <div className="tree-node">
    <div className={`tree-row ${activeModule === node.id ? "current" : ""}`} data-nav-id={node.id} style={{ "--tree-depth": depth } as React.CSSProperties}>
      {hasChildren ? <button className="tree-toggle" aria-label={`${isExpanded ? "收起" : "展开"} ${displayLabel}`} aria-expanded={isExpanded} onClick={() => onToggle(node.id)}><span /></button> : <span className="tree-spacer" />}
      <button className="tree-label" aria-current={activeModule === node.id ? "page" : undefined} onClick={() => onSelect(node.id)}>{displayLabel}</button>
    </div>
    {isExpanded && <div className="tree-children">{node.children?.map((child) => <TreeNavItem key={child.id} node={child} depth={depth + 1} activeModule={activeModule} expanded={expanded} onSelect={onSelect} onToggle={onToggle} />)}</div>}
  </div>;
}

function DetailModule({ page }: { page: ModulePage }) {
  return <div className="module-page" style={{ "--module-accent": page.accent } as React.CSSProperties}>
    <section className="module-hero"><div className="module-hero-grid"><div><p className="section-kicker">{page.eyebrow}</p><h1>{page.title}</h1><p>{page.lead}</p>{page.status && <span className="module-status">{page.status}</span>}</div><div className="module-visual" aria-hidden="true"><span /><span /><span /><i /></div></div></section>
    <section className="module-content-section"><div className="module-section-title"><p className="section-kicker">IN THIS SECTION</p><h2>内容结构</h2></div><div className="module-card-grid">{page.items.map((entry, index) => <article className="module-card" key={`${entry.meta}-${entry.title}`}><div className="module-card-index"><span>{entry.meta}</span><i>{String(index + 1).padStart(2, "0")}</i></div><h3>{entry.title}</h3><p>{entry.body}</p><span className="module-card-arrow" aria-hidden="true">↗</span></article>)}</div></section>
  </div>;
}

export function DesignSystemPage() {
  const [activeModule, setActiveModule] = useState<ModuleId>("overview");
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<Set<ModuleId>>(() => new Set(expandableIds));
  const contentRef = useRef<HTMLElement>(null);
  const matches = useMemo(() => { const keyword = query.trim().toLowerCase(); if (!keyword) return []; return allNavItems.filter((entry) => `${entry.label} ${modulePages[entry.id].title} ${modulePages[entry.id].eyebrow}`.toLowerCase().includes(keyword)).slice(0, 9); }, [query, allNavItems]);
  const selectModule = (id: ModuleId) => {
    const path = findNodePath(navigation, id);
    setExpanded((current) => new Set([...current, ...path.filter((node) => node.children?.length).map((node) => node.id)]));
    setActiveModule(id);
    setMenuOpen(false);
    setQuery("");
    requestAnimationFrame(() => requestAnimationFrame(() => {
      contentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
      document.querySelector<HTMLElement>(`[data-nav-id="${id}"]`)?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }));
  };
  const toggleNode = (id: ModuleId) => setExpanded((current) => { const next = new Set(current); if (next.has(id)) next.delete(id); else next.add(id); return next; });
  const activePath = findNodePath(navigation, activeModule);
  const activeRootId = activePath[0]?.id;

  return <div className="site-shell">
    <header className="global-header"><div className="global-header-inner"><button className="menu-toggle" aria-expanded={menuOpen} aria-label="切换目录" onClick={() => setMenuOpen((value) => !value)}><span /><span /></button><button className="brand brand-button" onClick={() => selectModule("overview")} aria-label="Design System 首页"><BrandGlyph /><span>Design System</span></button><nav className="global-nav" aria-label="全局导航"><button className={activeModule === "overview" ? "active" : ""} onClick={() => selectModule("overview")}>主页</button><button className={activeRootId === "section-resources" ? "active" : ""} onClick={() => selectModule("section-resources")}>资源</button><button className={activeModule === "changelog" ? "active" : ""} onClick={() => selectModule("changelog")}>更新</button></nav><div className="header-actions"><button className="header-icon search-shortcut" aria-label="打开搜索" onClick={() => document.getElementById("site-search")?.focus()} /></div></div></header>
    <div className="doc-header"><div className="doc-header-inner"><nav className="doc-breadcrumb" aria-label="当前章节路径">{activePath.map((node, index) => <span key={node.id}>{index > 0 && <i aria-hidden="true">›</i>}<button className={index === activePath.length - 1 ? "current" : ""} onClick={() => selectModule(node.id)}>{node.label}</button></span>)}</nav></div></div>
    <div className="workspace"><aside className={`sidebar ${menuOpen ? "open" : ""}`}><div className="sidebar-inner"><div className="search-wrap"><span className="search-icon" aria-hidden="true" /><input id="site-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="筛选全部层级" aria-label="筛选全部框架层级" autoComplete="off" />{query && <div className="search-results" role="listbox">{matches.length ? matches.map((entry) => <button key={entry.id} onClick={() => selectModule(entry.id)}><span>{displayNodeLabel(entry.label)}</span><small>{modulePages[entry.id].eyebrow}</small></button>) : <p>未找到匹配内容</p>}</div>}</div><nav className="sidebar-nav tree-nav" aria-label="完整框架目录">{navigation.map((node) => <TreeNavItem key={node.id} node={node} depth={0} activeModule={activeModule} expanded={expanded} onSelect={selectModule} onToggle={toggleNode} />)}</nav><div className="sidebar-foot"><span>网站同步状态</span><strong className="sync-status">已更新</strong></div></div></aside>
      {menuOpen && <button className="sidebar-scrim" aria-label="关闭目录" onClick={() => setMenuOpen(false)} />}
      <main className="content" ref={contentRef} tabIndex={-1} aria-live="polite"><div key={activeModule} className="module-view"><DetailModule page={modulePages[activeModule]} /></div><footer><div className="footer-brand"><BrandGlyph /><strong>Design System</strong></div><div className="footer-meta"><button onClick={() => contentRef.current?.scrollTo({ top: 0, behavior: "smooth" })}>返回顶部 ↑</button></div><p>网站内容依据《Design System 框架结构》更新；框架修改记录由独立变更日志持续维护。</p></footer></main>
    </div>
  </div>;
}
