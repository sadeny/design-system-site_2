"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { hmiFrameworkDocuments } from "./hmi-framework-documents-chatgpt";
import { MarkdownDocument } from "./MarkdownDocument";

type ModuleId = string;
type Language = "zh" | "en";
type ContentItem = { title: string; body: string; meta: string };
type LocalizedText = { zh: string; en: string };
type RichExample = { label: LocalizedText; targetId: ModuleId };
type RichSubsection = { title: LocalizedText; paragraphs: LocalizedText[]; examples?: RichExample[] };
type RichSection = { title: LocalizedText; tagline?: LocalizedText; paragraphs?: LocalizedText[]; subsections?: RichSubsection[]; refinements?: RichSubsection[]; closing?: LocalizedText };
type NavNode = { id: ModuleId; label: string; body?: string; accent?: string; children?: NavNode[] };
type ModulePage = {
  eyebrow: string;
  title: string;
  lead: string;
  accent: string;
  status?: string;
  items: ContentItem[];
  sections?: RichSection[];
  markdown?: string;
  noteTitle: string;
  note: string;
};

const item = (meta: string, title: string, body: string): ContentItem => ({ meta, title, body });
const t = (zh: string, en: string): LocalizedText => ({ zh, en });

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
    eyebrow: "1 · OVERVIEW", title: "Design System 框架结构", accent: "#0878e6",
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
    items: [],
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
  terminology: { eyebrow: "7.1 · OTHER", title: "专用术语表", accent: "#59616d", lead: "统一 HMI 设计规范中的专业术语及其解释。", items: [item("PRODUCT", "产品术语", "统一 HMI 与车辆相关概念。"), item("DESIGN", "设计术语", "统一 HMI 组件、模式、状态、变体和设计语言概念。"), item("TECH", "技术术语", "统一 HMI 平台、资源、实现与交付相关概念。")], noteTitle: "HMI 共同语言", note: "术语表用于减少 HMI 产品、设计、开发与合作团队之间的理解偏差。" },
  naming: { eyebrow: "7.2 · OTHER", title: "命名规范", accent: "#59616d", lead: "统一 HMI 文档、资源和设计对象的命名方式。", items: [item("FILES", "文件命名", "定义 HMI 文档、图片和交付文件的命名规则。"), item("DESIGN", "设计对象", "定义 HMI 页面、组件、变体、图层和变量命名。"), item("TOKENS", "资源与 Token", "定义 HMI 图标、组件库和设计 Token 的命名结构。")], noteTitle: "可查找、可维护", note: "HMI 命名应稳定、语义清晰、可扩展，并支持跨工具与跨团队协作。" },
  changelog: { eyebrow: "7.3 · OTHER", title: "更新日志", accent: "#59616d", lead: "记录 Design System 的版本和内容变更。", items: [item("2026.08.06", "框架结构重构", "重构七个一级栏目，更新设计原则、语言、模式、组件、资源和其他结构及编号。"), item("WEBSITE", "网站同步", "网站导航与模块内容已同步最新框架结构。")], noteTitle: "同步状态", note: "当前网站已同步最新框架；后续框架更新但网站未同步时，状态标签将显示“待更新”。" },
};

modulePages["design-dna"] = {
  eyebrow: "DESIGN DNA", title: "Design DNA", accent: "#6b63ff",
  lead: "Design DNA 是 HMI Guidelines 的核心设计基因，用于将品牌价值转化为可识别、可延续且可落地的体验特征。",
  items: [
    item("IDENTITY", "品牌基因", "提炼品牌最具识别度的价值、性格与体验特征。"),
    item("EXPRESSION", "体验表达", "将抽象基因映射到视觉、交互、声音、动效和内容表达。"),
    item("EVOLUTION", "持续演进", "在保持核心识别的基础上，支持不同车型、场景与技术阶段合理演进。"),
  ], noteTitle: "核心作用", note: "Design DNA 为后续设计语言、设计模式和组件规范提供共同的判断依据。",
};

for (const [code, title, description] of componentDescriptions) {
  modulePages[`component-${code.replace(".", "-")}`] = componentPage(code, title, description);
}

modulePages.overview.title = "HMI Guidelines";
modulePages.overview.lead = "HMI Guidelines 为 HMI 产品设计提供统一、清晰且可持续演进的指导，在保持整体一致性与规范性的同时，支持不同车型和使用场景中的差异化设计需求。";
modulePages.overview.sections = [
  {
    title: t("定义", "Definition"),
    paragraphs: [
      t("Design System 是一套由设计原则、设计语言、设计模式、设计组件和设计资源共同构成的设计指导体系。为产品设计提供统一、清晰且可持续演进的指导，在保持整体一致性与规范性的同时，支持不同平台和场景中的差异化设计需求。", "A Design System is a design guidance framework composed of principles, language, patterns, components, and resources. It provides consistent, clear, and sustainable guidance while supporting appropriate adaptation across platforms and contexts."),
      t("它将经过验证的设计理念、规则与解决方案进行系统化沉淀，为 HMI、APP 和 Web 等不同产品平台建立共同的设计基础。它不仅是一组视觉规范或组件资源，也是一套帮助团队理解设计方向、做出设计判断并解决实际问题的方法。", "It systematizes proven ideas, rules, and solutions to establish a shared foundation for HMI, app, and web products. Beyond visual standards and component assets, it helps teams understand direction, make decisions, and solve practical problems."),
      t("对于同一品牌下的不同产品，Design System 通过统一品牌识别、核心视觉语言、基础交互表达和内容语气等规范，帮助各产品保持连续、一致的品牌体验。不同产品仍可以根据自身定位、目标用户、使用场景和平台能力进行合理适配，但这些差异应建立在共同的品牌基础之上。", "Across products under one brand, the Design System aligns identity, core visual language, interaction expression, and tone to create a continuous experience. Each product can still adapt to its positioning, users, context, and platform capabilities on top of that shared foundation."),
    ],
  },
  {
    title: t("目标", "Goals"),
    paragraphs: [
      t("让 Design System 成为跨产品、跨平台和跨团队的共同设计语言。", "Make the Design System a shared language across products, platforms, and teams."),
      t("通过建立共同的设计基础，帮助在不同产品和平台中做出一致且符合实际场景的设计体验，为用户提供最佳的产品体验。它主要关注以下三个目标：", "By establishing a shared foundation, it supports consistent, context-aware decisions across products and platforms. It focuses on three goals:"),
    ],
    subsections: [
      { title: t("一致性", "Consistency"), paragraphs: [t("建立统一的体验逻辑和基础表达，使不同产品和平台能够呈现为同一个完整的产品体系。", "Establish shared experience logic and expression so products and platforms feel like one coherent system.")] },
      { title: t("规范性", "Standardization"), paragraphs: [t("沉淀清晰、可执行的设计原则和规则，为设计决策、方案评审与实际落地提供共同依据。", "Document clear, actionable principles and rules that support decisions, reviews, and implementation.")] },
      { title: t("差异化", "Differentiation"), paragraphs: [t("在共同基础上，充分考虑不同平台、用户、场景、交互方式和技术能力的差异，避免以形式上的统一限制合理的设计适配。", "Respect differences in platform, user, context, interaction, and technology without letting superficial uniformity constrain appropriate adaptation.")] },
    ],
    closing: t("通过以上目标，Design System 希望为团队提供可靠、系统且可复用的设计指导，帮助设计师在一致性与差异性之间做出更好的判断。", "Together, these goals provide reliable, systematic, and reusable guidance that helps designers balance consistency and differentiation."),
  },
  {
    title: t("内容构成", "What it includes"),
    subsections: [
      { title: t("设计模式", "Design Patterns"), paragraphs: [t("设计模式是针对产品中反复出现的系统、场景或交互问题所形成的通用解决思路。它帮助设计师理解一个完整体验应该如何组织，而不只关注单个页面或组件。", "Design patterns are reusable approaches to recurring system, scenario, and interaction problems. They explain how to organize a complete experience beyond a single screen or component.")], examples: [
        { label: t("HMI 核心基础", "HMI Core Foundations"), targetId: "pattern-hmi-core" }, { label: t("告警体系", "Alert System"), targetId: "pattern-alert" }, { label: t("语音体系", "Voice System"), targetId: "pattern-voice" },
      ] },
      { title: t("设计组件", "Components"), paragraphs: [t("设计组件是组成界面的基础单元。每个组件具有明确的用途、结构、状态和交互行为，可以在不同页面和场景中重复使用。", "Components are the basic building blocks of an interface. Each has a defined purpose, anatomy, states, and behavior for reuse across screens and scenarios.")], examples: [
        { label: t("Button", "Button"), targetId: "component-5-1" }, { label: t("Dialog", "Dialog"), targetId: "component-5-2" }, { label: t("Slider", "Slider"), targetId: "component-5-5" },
      ] },
      { title: t("设计资源", "Resources"), paragraphs: [t("设计资源是经过整理、可以直接用于设计工作的资源集合，帮助团队快速获取统一且可复用的设计资产。", "Resources are curated, ready-to-use assets that help teams quickly access consistent and reusable design materials.")], examples: [
        { label: t("ABT 组件库", "ABT Component Library"), targetId: "resource-components--6-1-1" }, { label: t("HUD 组件库", "HUD Component Library"), targetId: "resource-components--6-1-3" }, { label: t("图标库", "Icon Library"), targetId: "resource-icons" },
      ] },
    ],
  },
];
for (const section of modulePages.overview.sections) {
  const replace = (value?: LocalizedText) => { if (value) { value.zh = value.zh.replaceAll("Design System", "HMI Guidelines"); value.en = value.en.replaceAll("Design System", "HMI Guidelines"); } };
  replace(section.title); replace(section.tagline); replace(section.closing);
  section.paragraphs?.forEach(replace);
  section.subsections?.forEach((subsection) => { replace(subsection.title); subsection.paragraphs.forEach(replace); subsection.examples?.forEach((example) => replace(example.label)); });
}

modulePages["principle-general"].sections = [
  { title: t("One, and all｜兼顾每一个人与所有人", "One, and all"), tagline: t("为所有人而设计，也尊重每一个人。", "Design for everyone. Respect each person."), paragraphs: [t("面向广泛用户进行设计，同时关注每个人的不同。让核心体验清晰、易用并能够被所有人触达，也为不同能力、习惯、偏好与个性保留适当空间。", "Design for a broad range of people without losing sight of the individual. Make essential experiences clear and accessible to everyone, while leaving room for different abilities, habits, preferences, and personalities.")] },
  { title: t("Accessible Innovation｜可触达的创新", "Accessible Innovation"), tagline: t("让创新直观、易用且有价值。", "Make innovation intuitive and useful."), paragraphs: [t("只有当用户能够理解、使用并从中受益时，创新才有意义。从真实的用户需求出发，减少不必要的复杂度，将新的想法与技术转化为实用的体验，并创造明确价值。", "Innovation matters when people can understand it, use it, and benefit from it. Start with real user needs, reduce unnecessary complexity, and turn new ideas and technologies into practical experiences that create clear value.")] },
  { title: t("One, yet distinct｜同源有别", "One, yet distinct"), tagline: t("遵循共同原则，表达每个产品的独特之处。", "Build on shared principles. Express what makes each product unique."), paragraphs: [t("共同的基础让不同产品保持为同一个完整体系。每个产品都应遵循一致的核心原则、品牌语言和体验规范，再根据自身定位、目标用户与使用场景形成独特表达，同时不削弱整体一致性。", "A shared foundation keeps products recognizable as part of one system. Build every product on the same core principles, brand language, and experience standards, then adapt its expression to its positioning, users, and context without weakening overall consistency.")] },
];

modulePages["principle-hmi"].title = "HMI 设计原则";
modulePages["principle-hmi"].sections = [
  { title: t("Consistency｜一致性", "Consistency"), tagline: t("让体验在产品持续演进中保持一致。", "Keep the experience consistent as products evolve."), paragraphs: [t("在产品持续迭代的过程中，保持不同迭代周期、品牌和产品之间的体验一致性，确保价值、形式、可靠性和识别度的稳定。", "Throughout product iterations, maintain experience consistency across iteration cycles, brands, and products, ensuring stability in value, form, reliability, and recognizability.")] },
  { title: t("Multi sensory multi modal｜多感官、多模态", "Multi sensory, multi modal"), tagline: t("让多种输入方式与感官反馈协同形成完整体验。", "Connect every input and sense into one coherent experience."), paragraphs: [t("用户通过语音、手势和面部表情进行输入；车辆通过视觉、触觉、听觉和嗅觉提供反馈，形成丰富融合且令人难忘的体验。", "Users input through voice, gestures, and facial expressions, while the vehicle provides visual, tactile, auditory, and olfactory feedback to form richly integrated and memorable experiences.")] },
  { title: t("Follow user｜顺应用户", "Follow user"), tagline: t("顺应用户的需求、个性与既有习惯进行创新。", "Innovate around how people already think and act."), paragraphs: [t("深入理解用户需求并尊重个体差异。在不挑战用户既有习惯的前提下进行创新，提供愉悦且易于接受的体验。", "Deeply understand user needs and respect individual personalities. Innovate without challenging users’ existing habits to provide an enjoyable and easily acceptable experience.")] },
  { title: t("Metaphor｜隐喻", "Metaphor"), tagline: t("用熟悉的物理经验帮助用户理解数字交互。", "Build digital interactions on familiar physical experiences."), paragraphs: [t("将用户熟悉的物理交互映射到数字界面，创造直观、友好的体验；为用户操作提供清晰反馈，帮助用户更快学习和理解。", "Map familiar physical interactions to the digital interface and provide clear feedback, creating an intuitive experience that users can learn quickly.")] },
  { title: t("Proactive intelligence｜主动智能", "Proactive intelligence"), tagline: t("主动预判需求，让产品随着使用不断改善。", "Anticipate needs and improve with every interaction."), paragraphs: [t("主动感知用户所处的情境和需求，始终预判下一步。基于用户的共性与个性需求，提供超出预期的体验，让产品随着使用不断改善。", "Proactively perceive users’ contexts and needs, anticipate the next step, and deliver experiences that improve through use and exceed expectations.")] },
  { title: t("Signature experience｜标志性体验", "Signature experience"), tagline: t("创造令人难忘并愿意分享的标志性时刻。", "Create moments people remember and want to share."), paragraphs: [t("基于品牌和目标用户群体的特征，打造具有启发性、感染力和辨识度的体验，为用户留下值得分享的难忘时刻。", "Based on the characteristics of brands and user groups, deliver inspiring and impactful signature experiences that create memorable moments worth sharing.")] },
];
modulePages["principle-hmi"].title = "设计原则";
modulePages["principle-hmi"].lead = "整合 HMI Guidelines 的共同设计价值与座舱体验原则，为 HMI 产品设计提供统一的判断基础。";
const generalPrinciples = modulePages["principle-general"].sections ?? [];
const detailedHmiPrinciples = modulePages["principle-hmi"].sections ?? [];
const principleSubsection = (section: RichSection): RichSubsection => ({ title: section.title, paragraphs: [...(section.tagline ? [section.tagline] : []), ...(section.paragraphs ?? [])] });
modulePages["principle-hmi"].sections = [{
  title: t("总则", "General Principles"),
  paragraphs: [t("前三条原则构成 HMI Guidelines 的总则，定义共同的价值判断；后续原则是总则在 HMI 产品体验中的具体细化。", "The first three principles form the general foundation. The following principles refine that foundation for HMI product experiences.")],
  subsections: generalPrinciples.map(principleSubsection),
  refinements: detailedHmiPrinciples.map(principleSubsection),
}];
modulePages["section-principles"] = modulePages["principle-hmi"];

modulePages["language-interaction"].title = "交互方式";
modulePages["language-interaction"].lead = "定义视觉、语音、触控、手势与其他输入输出方式协同工作的交互规范。";
modulePages["language-core"].title = "主题设计元素（待定）";
modulePages["language-core"].lead = "用于收纳具有主题识别度的 HMI 设计元素；当前章节结构与命名仍在确认中。";
modulePages["language-core"].status = "待定";

modulePages["design-dna"].eyebrow = "2.1 · DESIGN DNA";
modulePages["design-dna"].title = "设计 DNA（待定）";
modulePages["design-dna"].status = "待定";
modulePages["principle-hmi"].eyebrow = "2.2 · HMI DESIGN PRINCIPLES";
modulePages["principle-hmi"].title = "HMI 设计原则";
modulePages["principle-hmi"].lead = "定义 HMI Guidelines 共同遵循的设计价值、判断标准与座舱体验原则。";
modulePages["language-type"].eyebrow = "3.1 · TYPOGRAPHY";
modulePages["language-color"].eyebrow = "3.2 · COLOR";
modulePages["language-icons"].eyebrow = "3.3 · ICONS";
modulePages["language-icons"].items = [];
modulePages["language-visual"].eyebrow = "3.4 · BASE STYLES";
modulePages["language-visual"].title = "基础样式";
modulePages["language-visual"].items = [item("3.4.1", "形状", "定义基础形态及其应用方式。"), item("3.4.2", "投影", "定义层级、悬浮和空间关系的阴影表现。"), item("3.4.3", "圆角", "定义界面元素的圆角规格。"), item("3.4.4", "间距", "定义元素之间的空间关系。"), item("3.4.5", "网格", "定义页面布局和内容对齐规则。")];
modulePages["language-interaction"].eyebrow = "3.5 · INTERACTION";
modulePages["language-interaction"].items = [item("3.5.1", "手势", "定义通过手势进行输入、操作和反馈的交互方式。"), item("3.5.2", "语音", "定义语音输入、反馈和交互方式。"), item("3.5.3", "TUI", "定义实体按键、旋钮、拨杆、开关、触控板及其他可触知硬件控制装置的交互原则，以及其与 GUI、语音和车辆状态的协同关系。")];
modulePages["language-sound"].eyebrow = "3.6 · SOUND";
modulePages["language-motion"].eyebrow = "3.7 · MOTION";
modulePages["language-dark"].eyebrow = "4.9 · DARK THEME";
modulePages["language-localization"].eyebrow = "4.10 · LOCALIZATION";
modulePages["pattern-system"].eyebrow = "4.1 · HMI PATTERNS";
modulePages["pattern-system"].title = "核心框架";
modulePages["pattern-system"].lead = "定义 HMI 系统级界面与功能的核心组织方式。";
modulePages["pattern-system"].items = [item("4.1.1", "核心布局定义", "定义系统核心界面的布局方式。"), item("4.1.2", "层级体系", "定义页面、浮层和信息之间的层级关系。"), item("4.1.3", "Launcher", "定义系统启动器的结构与使用方式。"), item("4.1.4", "APP 体系", "定义车载 APP 的组织和运行框架。"), item("4.1.5", "通知体系", "定义系统通知的类型、层级和呈现方式。"), item("4.1.6", "模态化", "定义模态内容的触发、展示和退出方式。"), item("4.1.7", "告警体系", "定义告警信息的等级和反馈方式。"), item("4.1.8", "APP List", "定义应用列表的结构与展示方式。"), item("4.1.9", "功能面板", "组织下拉面板、空调面板等快捷控制入口。"), item("4.1.10", "Widget", "定义系统小组件的内容、布局和使用方式。")];
modulePages["pattern-human"].eyebrow = "4.2 · HMI PATTERNS";
modulePages["pattern-human"].title = "HMI 人机交互基础";
modulePages["pattern-human"].items = [item("4.2.1", "人机区域", "划分人与界面发生交互的空间区域。"), item("4.2.2", "多用户交互", "定义多个用户共同使用系统时的交互方式。")];
modulePages["pattern-composition"].eyebrow = "4.3 · HMI PATTERNS";
modulePages["pattern-composition"].title = "HMI 系统核心组成";
modulePages["pattern-composition"].lead = "定义 HMI 系统的核心组成和屏幕类型。";
modulePages["pattern-composition"].items = [item("4.3.1", "FID", "定义 FID 界面的信息呈现与设计模式。"), item("4.3.2", "Smart Surface", "定义 Smart Surface 的信息呈现与交互模式。"), item("4.3.3", "HUD", "定义抬头显示界面的设计模式。"), item("4.3.4", "ABT", "定义 ABT 界面的设计模式。"), item("4.3.5", "Co-driver Screen", "定义副驾驶屏界面的设计模式。"), item("4.3.6", "Roof Screen", "定义车顶屏界面的设计模式。"), item("4.3.7", "Rear Console Screen", "定义后排控制屏界面的设计模式。"), item("4.3.8", "Arm Rest Screen", "定义扶手屏界面的设计模式。")];
modulePages["pattern-3d"].eyebrow = "4.4 · HMI PATTERNS";
modulePages["pattern-3d"].items = modulePages["pattern-3d"].items.map((entry, index) => ({ ...entry, meta: `4.4.${index + 1}` }));
modulePages["pattern-voice"].eyebrow = "4.5 · HMI PATTERNS";
modulePages["pattern-voice"].items = modulePages["pattern-voice"].items.map((entry, index) => ({ ...entry, meta: `4.5.${index + 1}` }));
modulePages["pattern-function"].eyebrow = "4.6 · HMI PATTERNS";
modulePages["pattern-function"].items = modulePages["pattern-function"].items.map((entry, index) => ({ ...entry, meta: `4.6.${index + 1}` }));
modulePages["pattern-exterior"].eyebrow = "4.7 · HMI PATTERNS";
modulePages["pattern-exterior"].items = modulePages["pattern-exterior"].items.map((entry, index) => ({ ...entry, meta: `4.7.${index + 1}` }));
modulePages["language-core"].eyebrow = "4.8 · HMI PATTERNS";

const codeId = (code: string) => code.replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-|-$/g, "");
const leaf = (parentId: string, code: string, title: string, body: string, children?: NavNode[]): NavNode => ({ id: `${parentId}--${codeId(code)}`, label: `${code} ${title}`, body, children });
const moduleNode = (id: string, label: string, nested: Record<string, NavNode[]> = {}): NavNode => ({
  id, label, body: modulePages[id].lead, accent: modulePages[id].accent,
  children: modulePages[id].items.filter((entry) => /^\d/.test(entry.meta)).map((entry) => leaf(id, entry.meta, entry.title, entry.body, nested[entry.meta])),
});

const navigation: NavNode[] = [
  { id: "explanation", label: "0. 说明", body: "说明当前 HMI Guidelines 的规范状态、适用边界与后续维护方式。", accent: "#d97706" },
  { id: "overview", label: "1. overview", body: modulePages.overview.lead, accent: "#0878e6" },
  { id: "section-ideas", label: "2. 设计理念", body: "用于定义 HMI Guidelines 的核心设计思想。", accent: "#18a66a", children: [
    { id: "design-dna", label: "2.1 设计 DNA（待定）", body: modulePages["design-dna"].lead },
    { id: "section-principles", label: "2.2 HMI 设计原则", body: modulePages["principle-hmi"].lead },
  ] },
  { id: "section-language", label: "3. 设计语言", body: "用于定义 Design System 的统一感知与交互表达。", accent: "#695cff", children: [
    moduleNode("language-type", "3.1 字体"), moduleNode("language-color", "3.2 色彩"), moduleNode("language-icons", "3.3 图标"), moduleNode("language-visual", "3.4 基础样式"), moduleNode("language-interaction", "3.5 交互方式"), moduleNode("language-sound", "3.6 声音"), moduleNode("language-motion", "3.7 动效"),
  ] },
  { id: "section-patterns", label: "4. 设计模式", body: "用于沉淀常见场景下可复用的设计解决方案。", accent: "#00a0a8", children: [
      moduleNode("pattern-system", "4.1 核心框架", {
        "4.1.4": [leaf("pattern-system--4-1-4", "4.1.4.1", "策略", "用于定义 APP 体系的整体设计策略。"), leaf("pattern-system--4-1-4", "4.1.4.2", "APP 框架", "用于定义 APP 的通用结构框架。")],
        "4.1.9": [leaf("pattern-system--4-1-9", "4.1.9.1", "下拉面板", "用于定义下拉快捷面板的结构和交互。"), leaf("pattern-system--4-1-9", "4.1.9.2", "空调面板", "用于定义空调面板的结构和交互。")],
      }),
      moduleNode("pattern-human", "4.2 HMI 人机交互基础"), moduleNode("pattern-composition", "4.3 HMI 系统核心组成"),
      moduleNode("pattern-3d", "4.4 3D 体系"), moduleNode("pattern-voice", "4.5 语音体系", {
        "4.5.1": [leaf("pattern-voice--4-5-1", "4.5.1.1", "逻辑状态", "用于定义 Avatar 在不同语音阶段的状态变化。")],
      }),
      moduleNode("pattern-function", "4.6 功能模式", {
        "4.6.6": [leaf("pattern-function--4-6-6", "4.6.6.1", "个性化", "用于定义与账号关联的个性化体验。")],
      }), moduleNode("pattern-exterior", "4.7 车外 HMI"),
    moduleNode("language-core", "4.8 主题设计元素（待定）"), moduleNode("language-dark", "4.9 深色主题"), moduleNode("language-localization", "4.10 国际化 / 本地化"),
  ] },
  { id: "section-components", label: "5. 设计组件", body: "用于收录可复用的界面组件及其使用规范。", accent: "#ff7849", children: componentDescriptions.map(([code, title]) => ({ id: `component-${code.replace(".", "-")}`, label: `${code} ${title}`, body: modulePages[`component-${code.replace(".", "-")}`].lead })) },
  { id: "section-other", label: "7. 其他", body: "用于收录术语、命名和更新记录等支持性内容。", accent: "#59616d", children: [{ id: "terminology", label: "7.1 专用术语表", body: modulePages.terminology.lead }, { id: "naming", label: "7.2 命名规范", body: modulePages.naming.lead }, { id: "changelog", label: "7.3 更新记录", body: "记录 HMI 设计规范的重要更新及维护信息。" }] },
];

// Match the current HMI-specific framework while preserving established page IDs.
const languageRoot = navigation.find(node => node.id === "section-language")!;
const patternsRoot = navigation.find(node => node.id === "section-patterns")!;
const patternById = new Map(patternsRoot.children!.map(node => [node.id, node]));
const node = (id: string, label: string, body: string, children?: NavNode[]): NavNode => ({ id, label, body, children });
const human = patternById.get("pattern-human")!;
const composition = patternById.get("pattern-composition")!;
human.label = "4.1 HMI 人机交互基础";
composition.label = "4.2.1 核心组成";
human.children = [
  human.children![0],
  node("pattern-multi-scenario", "4.1.1.2 多场景人机交互", "用于定义 HMI 在不同用车场景、车辆状态和任务情境下的人机交互方式。"),
  human.children![1],
];
human.children[0].label = "4.1.1 人机关系";
human.children[0].body = "用于划分人与界面发生交互的空间区域。";
composition.children = undefined;
modulePages["pattern-composition"].items = [
  item("PART", "FID", "即传统的仪表，布局在方向盘前方，用于呈现驾驶相关信息。"),
  item("PART", "Smart Surface", "让屏幕硬件与座舱内饰材质融合，并在表面显示数字信息。"),
  item("PART", "HUD", "用于定义抬头显示界面的信息呈现与设计模式。"),
  item("PART", "ABT", "中控屏，用于定义核心功能的信息呈现与设计模式。"),
  item("PART", "Co-driver Screen", "副驾屏，用于定义副驾驶屏界面的信息呈现与设计模式。"),
  item("PART", "Roof Screen", "可收起、可展开的后排吸顶屏。"),
  item("PART", "Rear Console Screen", "布局在前排左右座椅之间的后排中控屏。"),
  item("PART", "Arm Rest Screen", "布局在后排座椅扶手上的屏幕。"),
];
const systemFramework = node("pattern-hmi-core", "4.2 HMI 系统核心框架", "用于定义 HMI 系统的核心组成、核心框架及多屏联动关系。", [
  composition,
  node("pattern-core-layout", "4.2.2 框架定义", "用于定义整个 HMI 系统中不同媒介屏幕的框架布局，并作为所有功能模块共同遵循的全局布局基础。"),
  node("pattern-multiscreen", "4.2.3 多屏联动", "用于定义座舱内不同屏幕之间的信息协同、任务接续与交互联动方式。"),
]);
const voiceSystem = patternById.get("pattern-voice")!;
voiceSystem.children = [
  node("voice-principles", "4.3.1 设计原则和理念", "用于定义当前具体语音 VUI 的设计理念、体验目标与设计原则，为语音体系的具体设计提供判断依据。"),
  node("voice-flow", "4.3.2 语音交互通用流程", "用于定义从唤醒、输入、识别、理解、执行到反馈的通用交互流程。"),
  node("voice-framework", "4.3.3 语音体系核心框架", "用于定义语音体系的核心组成、信息关系及各交互阶段的协同框架。"),
  node("voice-avatar", "4.3.4 avatar设计", "用于定义语音助手 avatar 的形象、状态表达及其在交互过程中的呈现方式。"),
  node("voice-key-features", "4.3.5 语音交互重点功能", "用于收录多音区语音交互、可见即可说、语音免唤醒和语音双工等重点功能设计。"),
];
languageRoot.children!.unshift(node("language-accessibility", "3.1 Accessibility｜普适性", "用于定义覆盖不同用户、用户状态、座舱位置、车辆场景、环境条件和硬件能力的基础设计要求与检查标准。"));
languageRoot.children!.splice(5, 0, patternById.get("pattern-3d")!);
const interactionMode = languageRoot.children!.find(entry => entry.id === "language-interaction");
if (interactionMode) interactionMode.label = "3.7 多模态交互";
patternsRoot.children = [
  human, systemFramework, voiceSystem,
  node("pattern-hierarchy", "4.4 层级体系", "用于定义页面、浮层和信息之间的层级关系。"),
  node("pattern-app-system", "4.5 APP应用体系", "用于定义车载 APP 的整体策略、通用 APP 框架及第三方应用框架。"),
  node("pattern-notification", "4.7 通知体系", "用于定义系统通知的类型、层级和呈现方式。"),
  node("pattern-alert", "4.8 告警体系", "用于定义告警信息的等级和反馈方式。"),
  node("pattern-audio-strategy", "4.9 音频策略体系", "用于定义系统声音、提示音、告警音及其他音频反馈的使用策略、优先级和协同关系。"),
  node("pattern-app-list", "4.10 APPList", "用于定义应用列表的结构与展示方式。"),
  node("pattern-home-strategy", "4.11 Home键策略", "用于定义 Home 键的功能定位、触发逻辑、返回目标、状态反馈及跨场景一致性策略。"),
  node("pattern-function-panel", "4.11 功能面板", "用于组织常用功能和快捷控制入口。", [node("pattern-quick-panel", "4.11.1 下拉面板", "用于定义下拉快捷面板的结构和交互。"), node("pattern-climate-panel", "4.11.2 空调面板", "用于定义空调控制面板的结构和交互。")]),
  node("pattern-widget", "4.12 Widget", "用于定义系统小组件的内容、布局和使用方式。"),
  node("pattern-showroom", "4.13 展车模式", "用于定义车辆展示场景下的系统体验。"),
  node("pattern-charging", "4.14 充电模式", "用于定义车辆充电场景下的信息呈现、状态反馈与交互方式。"),
  node("pattern-third-space", "4.15 第三空间模式", "用于定义车辆在非驾驶状态下作为生活与休闲空间时的场景体验和交互方式。"),
  node("pattern-activation-oobe", "4.16 激活引导/OOBE体系", "用于定义系统或功能首次激活时的引导流程与首次使用体验。"),
  node("pattern-startup-motion", "4.17 开机动画", "用于定义系统启动过程中的动画表现。"),
  node("pattern-feature-guidance", "4.18 功能引导体系", "用于帮助用户理解和使用具体功能。"),
  node("pattern-account", "4.19 账号体系", "用于定义账号登录、身份和相关体验。"),
  node("pattern-basic-driving", "4.20 基础驾驶", "用于定义基础驾驶场景下的界面与交互模式。"),
  node("pattern-assisted-driving", "4.21 辅助驾驶体系", "用于定义辅助驾驶场景下的信息呈现、状态反馈、功能控制与人机协同方式。"),
  node("pattern-assistance-view", "4.22 辅助影像体系", "用于定义车辆辅助影像的展示和操作模式。"),
  node("pattern-lighting", "4.23 灯光交互", "用于定义通过车外灯光传递车辆状态、反馈和意图的交互方式。"),
  patternById.get("language-core")!, patternById.get("language-dark")!, patternById.get("language-localization")!,
  node("pattern-tui", "4.27 TUI 体系", "用于定义实体硬件控件的操作模式、功能映射及其与界面、语音和车辆状态的协同方式。"),
];
patternById.get("pattern-3d")!.label = "3.5 3D体系";
patternById.get("language-localization")!.label = "4.26 国际化/本地化";
modulePages["pattern-exterior"].items = [];
function synchronizeNumbers(nodes: NavNode[], prefix: string) {
  nodes.forEach((entry, index) => {
    const code = `${prefix}.${index + 1}`;
    entry.label = `${code} ${entry.label.replace(/^\d+(?:\.\d+)*\.?\s*/, "")}`;
    if (entry.children?.length) synchronizeNumbers(entry.children, code);
    const page = modulePages[entry.id];
    if (page) {
      page.eyebrow = `${code} · FRAMEWORK`;
      page.title = entry.label.replace(/^\d+(?:\.\d+)*\.?\s*/, "");
      page.lead = entry.body ?? page.lead;
      if (entry.children?.length) page.items = entry.children.map(child => { const [meta, ...title] = child.label.split(" "); return item(meta, title.join(" "), child.body ?? ""); });
    }
  });
}
synchronizeNumbers(languageRoot.children!, "3");
synchronizeNumbers(patternsRoot.children, "4");

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
modulePages["pattern-app-system"].items = [
  item("PART", "策略", "用于定义 APP 应用体系的整体设计策略。"),
  item("PART", "APP 框架", "用于定义车载 APP 的通用结构框架。"),
  item("PART", "第三方应用框架", "用于定义第三方应用接入 HMI 系统时的界面框架、信息组织、交互边界及协同规则。"),
];
for (const entry of allNavItems) {
  const code = entry.label.match(/^(\d+(?:\.\d+)*)\.?\s/)?.[1];
  const document = code ? hmiFrameworkDocuments[code] : undefined;
  if (!document) continue;
  const title = document.title === "卡片（待确认）" ? "卡片（待定）" : document.title;
  entry.label = `${code} ${title}`;
  modulePages[entry.id].eyebrow = `${code} · FRAMEWORK`;
  modulePages[entry.id].title = title;
  modulePages[entry.id].lead = document.lead;
  modulePages[entry.id].markdown = document.markdown;
}

modulePages.explanation.status = "草稿";

modulePages.changelog.title = "更新记录";
modulePages.changelog.lead = "集中记录 HMI 设计规范的重要更新，便于追溯框架和内容的变化。";
modulePages.changelog.markdown = `## HMI 规范更新记录

| 序号 | 更新主要内容 | 更新时间 | 更新作者 | 备注说明 |
|---|---|---|---|---|
| 1 | 初步更新 HMI 规范框架 | 2026-09-09 | Fan | 初步梳理 HMI 框架，整体框架待讨论 |`;

function BrandGlyph() { return <span className="brand-glyph" aria-hidden="true"><i /><i /><i /></span>; }
const displayNodeLabel = (label: string) => label.replace(/^\d+(?:\.\d+)*\.?\s*/, "");
const englishNames: Record<string, string> = {
  "HMI 人机交互基础": "HMI Interaction Foundations", "HMI 系统核心框架": "HMI Core System Framework", "核心组成": "Core Composition", "框架定义": "Framework Definition", "语音交互的设计原则和理念": "Voice Design Principles and Philosophy", "语音交互通用流程": "General Voice Interaction Flow", "语音体系核心框架": "Voice System Core Framework", "avatar设计": "Avatar Design", "语音交互重点功能": "Key Voice Features", "多音区语音交互": "Multi-zone Voice Interaction", "可见即可说": "See It, Say It", "语音免唤醒": "Wake-word-free Voice", "语音双工": "Full-duplex Voice", "第三方应用框架": "Third-party App Framework", "灯光交互": "Lighting Interaction",
  "HMI 人机交互关系": "HMI Interaction Relationships", "人机关系": "Human-machine Relationships", "HMI 核心框架定义": "HMI Core Framework Definition", "多屏联动": "Multi-screen Coordination", "充电模式": "Charging Mode", "第三空间模式": "Third-space Mode", "辅助驾驶体系": "Assisted Driving System", "车外HMI交互": "Exterior HMI Interaction",
  "HMI 核心基础": "HMI Core Foundations", "音频策略体系": "Audio Strategy System", "TUI 体系": "TUI System", "激活引导/OOBE体系": "Activation / OOBE System", "功能引导体系": "Feature Guidance System", "辅助影像体系": "Assistance View System",
  "手势": "Gestures", "TUI": "TUI", "HMI 系统": "HMI System",
  overview: "Overview", "说明": "About", "设计原则": "Design Principles", "HMI 设计": "HMI Design", "APP 设计": "App Design", "Web 设计": "Web Design",
  "设计语言": "Design Language", "品牌规范": "Brand Guidelines", "字体": "Typography", "色彩": "Color", "图标": "Icons", "通用基础图标": "General Icons", "驾驶图标": "Driving Icons", "车控图标": "Vehicle Control Icons", "拓展图标": "Extended Icons",
  "设计理念": "Design Philosophy", "设计 DNA（待定）": "Design DNA (TBD)", "HMI 设计原则": "HMI Design Principles", "基础样式": "Base Styles", "形状": "Shape", "投影": "Shadow", "圆角": "Corner Radius", "间距": "Spacing", "网格": "Grid", "交互方式": "Interaction", "语音": "Voice", "声音": "Sound", "动效": "Motion", "深色主题": "Dark Theme", "国际化 / 本地化": "Internationalization / Localization",
  "核心视觉元素": "Core Visual Elements", "主题设计元素（待定）": "Themed Design Elements (TBD)", "车模": "Vehicle Model", "导航图标": "Navigation Icons", "导航 / 智驾引导线": "Navigation / Assisted Driving Guidance", "智驾相关元素": "Assisted Driving Elements", "车道引导箭头": "Lane Guidance Arrows", "Home 按键": "Home Button", "启动 P 档?": "Startup / Park",
  "设计模式": "Design Patterns", "HMI 系统核心组成": "HMI Core System Composition", "HMI 人机交互基础": "HMI Interaction Foundations", "人机区域": "Interaction Zones", "多场景人机交互": "Multi-scenario Interaction", "多用户交互": "Multi-user Interaction", "核心框架": "Core Framework", "核心布局定义": "Core Layout", "层级体系": "Hierarchy", "APP 体系": "App System", "策略": "Strategy", "APP 框架": "App Framework", "通知体系": "Notification System", "模态化": "Modality", "告警体系": "Alert System", "功能面板": "Function Panels", "下拉面板": "Quick Panel", "空调面板": "Climate Panel",
  "3D 体系": "3D System", "3D体系": "3D System", "国际化/本地化": "Internationalization / Localization", "感知信息": "Perception Information", "地理信息": "Geographic Information", "功能辅助信息": "Supporting Information", "语音体系": "Voice System", "逻辑状态": "Logic States", "GUI 结果卡片": "GUI Result Cards", "功能模式": "Functional Modes", "展车模式": "Showroom Mode", "激活引导": "Activation Guide", "开机动画": "Startup Animation", "功能引导": "Feature Guide", "账号体系": "Account System", "个性化": "Personalization", "基础驾驶": "Basic Driving", "辅助影像": "Assistance View", "车外 HMI": "Exterior HMI", "灯光": "Lighting", "语音交互": "Voice Interaction",
  "设计组件": "Components", "卡片": "Card", "进度条": "Progress Bar", "设计资源": "Resources", "组件库": "Component Libraries", "后排": "Rear Seat", "图标库": "Icon Library", "其他": "Other", "专用术语表": "Glossary", "命名规范": "Naming Guidelines", "更新记录": "Update Log", "更新日志": "Changelog",
  "用途与适用场景": "Purpose and Use Cases", "结构与变体": "Anatomy and Variants", "状态与行为": "States and Behavior", "使用规范": "Usage Guidelines", "内容结构": "Content Structure",
};
const localizeName = (value: string, language: Language) => language === "en" ? (englishNames[value] ?? value) : value;
const localizedNodeLabel = (label: string, language: Language) => localizeName(displayNodeLabel(label), language);
const cleanKicker = (value: string) => value.replace(/^\d+(?:\.\d+)*\s*·\s*/, "").replace(/^·\s*/, "");

function TreeNavItem({ node, depth, activeModule, expanded, language, onSelect, onToggle }: { node: NavNode; depth: number; activeModule: ModuleId; expanded: Set<ModuleId>; language: Language; onSelect: (id: ModuleId) => void; onToggle: (id: ModuleId) => void }) {
  const hasChildren = Boolean(node.children?.length);
  const isExpanded = hasChildren && expanded.has(node.id);
  const displayLabel = localizedNodeLabel(node.label, language);
  return <div className="tree-node">
    <div className={`tree-row ${activeModule === node.id ? "current" : ""}`} data-nav-id={node.id} style={{ "--tree-depth": depth } as React.CSSProperties}>
      {hasChildren ? <button className="tree-toggle" aria-label={`${isExpanded ? "收起" : "展开"} ${displayLabel}`} aria-expanded={isExpanded} onClick={() => onToggle(node.id)}><span /></button> : <span className="tree-spacer" />}
      <button className="tree-label" aria-current={activeModule === node.id ? "page" : undefined} onClick={() => onSelect(node.id)}>{displayLabel}</button>
    </div>
    {isExpanded && <div className="tree-children">{node.children?.map((child) => <TreeNavItem key={child.id} node={child} depth={depth + 1} activeModule={activeModule} expanded={expanded} language={language} onSelect={onSelect} onToggle={onToggle} />)}</div>}
  </div>;
}

function DetailModule({ page, language, isTopLevel, onSelect }: { page: ModulePage; language: Language; isTopLevel: boolean; onSelect: (id: ModuleId) => void }) {
  const title = localizeName(page.title, language);
  const hmiCopy = (value: string) => value.replaceAll("Design System", "HMI Guidelines");
  return <div className="module-page" style={{ "--module-accent": page.accent } as React.CSSProperties}>
    <section className="module-hero"><div className="module-hero-grid"><div><h1>{title}</h1><p>{language === "en" ? `Defines the scope, principles, and usage guidance for ${title}.` : hmiCopy(page.lead)}</p>{page.status && <span className={`module-status ${page.status === "草稿" ? "draft" : ""}`}>{language === "en" ? (page.status === "待定" ? "To be determined" : page.status === "草稿" ? "Status · Draft" : "Website synced") : page.status === "草稿" ? "当前状态 · 草稿" : page.status}</span>}</div></div></section>
    {page.markdown ? <MarkdownDocument source={page.markdown} language={language} /> : page.sections ? <div className="module-document">{page.sections.map((section, sectionIndex) => <section className="document-section" key={`${section.title.zh}-${sectionIndex}`}>
      <div className="document-section-heading"><h2>{section.title[language]}</h2></div>
      {section.tagline && <p className="document-tagline">{section.tagline[language]}</p>}
      {section.paragraphs?.map((paragraph, index) => <p className="document-paragraph" key={index}>{paragraph[language]}</p>)}
      {section.subsections && <div className="document-subsections">{section.subsections.map((subsection) => <article className="document-subsection" key={subsection.title.zh}>
        <h3>{subsection.title[language]}</h3>
        {subsection.paragraphs.map((paragraph, index) => <p key={index}>{paragraph[language]}</p>)}
        {subsection.examples && <div className="document-examples"><span>{language === "en" ? "Examples" : "典型示例"}</span>{subsection.examples.map((example) => <button key={example.targetId} onClick={() => onSelect(example.targetId)}>{example.label[language]} <i aria-hidden="true">↗</i></button>)}</div>}
      </article>)}</div>}
      {section.refinements && <div className="document-section document-refinement-section"><div className="document-section-heading"><h2>{language === "en" ? "Design details" : "设计细则"}</h2></div><p className="document-paragraph">{language === "en" ? "These details translate the general foundation into concrete guidance for HMI experiences." : "以下细则将设计总则进一步转化为适用于 HMI 产品体验的具体指导。"}</p><div className="document-subsections">{section.refinements.map((subsection) => <article className="document-subsection" key={subsection.title.zh}><h3>{subsection.title[language]}</h3>{subsection.paragraphs.map((paragraph, index) => <p key={index}>{paragraph[language]}</p>)}</article>)}</div></div>}
      {section.closing && <p className="document-closing">{section.closing[language]}</p>}
    </section>)}</div> : <section className={`module-content-section ${isTopLevel ? "top-level-content" : ""}`}>{!isTopLevel && <div className="module-section-title"><h2>{language === "en" ? "Content Structure" : "内容结构"}</h2></div>}<div className="module-card-grid">{page.items.map((entry, index) => { const entryTitle = localizeName(entry.title, language); return <article className={`module-card ${isTopLevel ? "top-level-card" : ""}`} key={`${entry.meta}-${entry.title}`}><div className="module-card-index">{!isTopLevel && <span>{entry.meta}</span>}<i>{String(index + 1).padStart(2, "0")}</i></div><h3>{entryTitle}</h3><p>{language === "en" ? `Defines the structure, behavior, and usage guidance for ${entryTitle}.` : entry.body}</p>{isTopLevel ? <i className="module-card-arrow" aria-hidden="true">↗</i> : <span className="module-card-arrow" aria-hidden="true">↗</span>}</article>; })}</div></section>}
  </div>;
}

function HomePage({ language, onOpenPlatform, onOpenFeature }: { language: Language; onOpenPlatform: (platform: "hmi" | "web" | "app") => void; onOpenFeature: (page: FeaturePageId, module: string | null) => void }) {
  const pageRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const page = pageRef.current;
    const hero = heroRef.current;
    if (!page || !hero) return;
    const header = document.querySelector<HTMLElement>(".global-header");
    const updateHeader = () => header?.classList.toggle("hero-context", page.scrollTop < hero.offsetHeight);
    updateHeader();
    page.addEventListener("scroll", updateHeader, { passive: true });
    return () => {
      page.removeEventListener("scroll", updateHeader);
      header?.classList.remove("hero-context");
    };
  }, []);
  const cards = [
    { key: "hmi", kicker: "IN-VEHICLE EXPERIENCE", title: "Design Guidelines for HMI", shortTitle: "HMI", zh: "围绕驾驶安全、多屏协同与多模态交互，构建清晰、自然且具有品牌识别度的座舱体验。", en: "Create clear, natural, and distinctive in-vehicle experiences across screens and interaction modes." },
    { key: "app", kicker: "MOBILE EXPERIENCE", title: "Design Guidelines for APP", shortTitle: "APP", zh: "连接用户、车辆与服务，让移动场景中的任务简洁、连续，并尊重平台原生使用习惯。", en: "Connect people, vehicles, and services through simple, continuous, platform-native mobile experiences." },
    { key: "web", kicker: "WEB EXPERIENCE", title: "Design Guidelines for Web", shortTitle: "Web", zh: "通过响应式布局、高效操作和清晰的信息层级，支持从浏览到专业任务的多样化体验。", en: "Support browsing and professional tasks with responsive layouts, efficient actions, and clear hierarchy." },
  ];
  return <main className="home-page" ref={pageRef}>
    <section className="home-hero-card" ref={heroRef}>
      <div className="home-hero-copy"><h1>Design System</h1><span>{language === "en" ? "Pursue the best design experience through clear, shared, and actionable guidance." : "以清晰、统一且可执行的设计指导，持续追求最佳的设计体验。"}</span><div className="home-hero-actions"><button onClick={() => onOpenPlatform("hmi")}>HMI Guidelines <i aria-hidden="true">→</i></button><button onClick={() => onOpenPlatform("web")}>Web Guidelines <i aria-hidden="true">→</i></button><button onClick={() => onOpenPlatform("app")}>App Guidelines <i aria-hidden="true">→</i></button><button onClick={() => onOpenFeature("sound", null)}>Sound Library <i aria-hidden="true">→</i></button></div></div>
      <div className="home-hero-visual"><img src="/design-system-ai-hero.png" alt={language === "en" ? "AI-connected automotive design system across vehicle, HMI, mobile, and design components" : "由 AI 连接汽车、车机、手机与设计组件的设计规范体系"} /></div>
    </section>
    <section className="home-platform-section" aria-labelledby="home-platform-title"><div className="home-section-heading"><div><p>DESIGN FOR EVERY SURFACE</p><h2 id="home-platform-title">Design Guidelines</h2></div><span>{language === "en" ? "Shared principles and brand foundations, with the right expression for every context." : "共享原则与品牌基础，并为不同场景保留恰当的表达方式。"}</span></div>
      <div className="home-card-grid">{cards.map((card) => <button className="home-platform-card home-guideline-card" key={card.key} onClick={() => onOpenPlatform(card.key as "hmi" | "web" | "app")}><div className={`home-card-art ${card.key}-art`}>{card.key === "hmi" ? <><div className="home-hmi-screen"><span /><span /><i /><b /></div><div className="home-hmi-line" /></> : card.key === "app" ? <><div className="home-app-phone"><span /><i /><b /><em /></div><div className="home-app-ring" /></> : <div className="home-web-window"><div /><span /><span /><i /><b /></div>}</div><div className="home-card-copy"><h3>{card.title}</h3><span>{card[language]}</span><span className="home-card-link">{language === "en" ? `Explore ${card.shortTitle}` : `探索 ${card.shortTitle}`} <i aria-hidden="true">→</i></span></div></button>)}</div>
    </section>
    {(["sound", "ai", "explore"] as FeaturePageId[]).map((pageId) => { const page = featurePages[pageId]; return <section className="home-platform-section home-feature-section" key={pageId}><div className="home-section-heading"><div><p>{page.eyebrow}</p><h2>{page.title[language]}</h2></div><span>{page.description[language]}</span></div><div className="home-card-grid">{page.modules.map((module) => <button className="home-platform-card home-linked-card" key={module.id} onClick={() => onOpenFeature(pageId, module.id)}><div className={`home-card-art feature-art-${module.art}`}><i /><i /><i /><b /></div><div className="home-card-copy"><h3>{module.title[language]}</h3><span>{module.description[language]}</span><span className="home-card-link">{language === "en" ? "Open module" : "查看模块"} →</span></div></button>)}</div></section>; })}
    <SiteFooter language={language} onBackToTop={() => document.querySelector<HTMLElement>(".home-page")?.scrollTo({ top: 0, behavior: "smooth" })} />
  </main>;
}

type FeaturePageId = "sound" | "explore" | "ai";
type FeatureModule = { id: string; title: LocalizedText; description: LocalizedText; art: string };
const independentModuleNotice = t(
  "该部分属于独立模块，具体结构和内容待补充，当前网站中的所有信息内容都是示意，没有任何参考意义。",
  "This is an independent module whose structure and content are still to be completed. All information currently shown on this website is illustrative only and should not be used as a reference.",
);
const featurePages: Record<FeaturePageId, { eyebrow: string; title: LocalizedText; description: LocalizedText; modules: FeatureModule[] }> = {
  sound: { eyebrow: "SONIC EXPERIENCE", title: t("Sound Library", "Sound Library"), description: t("汇集声音设计规范、界面反馈音与品牌声音资产，为 HMI、App 和 Web 建立一致且可识别的听觉体验。", "Guidelines, interface cues, and brand audio assets for a consistent and recognizable sonic experience across HMI, App, and Web."), modules: [
    { id: "sound-guidelines", title: t("声音设计指南（待定）", "Sound Design Guidelines (TBD)"), description: t("定义声音的体验角色、使用原则、层级关系与多模态协同方式。", "Define the roles, principles, hierarchy, and multimodal coordination of sound."), art: "workflow" },
    { id: "brand-sounds", title: t("品牌声音库（待定）", "Brand Sound Library (TBD)"), description: t("沉淀启动、标志性提示与品牌识别所需的声音资产。", "Signature audio assets for startup moments, branded cues, and sonic identity."), art: "knowledge" },
    { id: "interface-sounds", title: t("界面声音库（待定）", "Interface Sound Library (TBD)"), description: t("收录操作反馈、系统状态、任务结果与通知等常用界面声音。", "Reusable audio cues for actions, system states, task results, and notifications."), art: "prompt" },
  ] },
  explore: { eyebrow: "DESIGN EXPLORATION", title: t("探索", "Explore"), description: t("汇集设计分享、前沿探索与实践案例，为团队提供开放的灵感来源，并推动新的设计方向从思考走向验证。", "A space for design sharing, forward-looking exploration, and practical cases that turns new ideas into validated directions."), modules: [
    { id: "design-sharing", title: t("设计分享", "Design Sharing"), description: t("分享团队经验、设计方法和项目洞察，促进知识在不同产品与专业之间流动。", "Share team experience, methods, and project insights across products and disciplines."), art: "sharing" },
    { id: "concept-exploration", title: t("概念探索", "Concept Exploration"), description: t("围绕未来场景、交互方式与视觉表达开展概念研究和快速验证。", "Research and validate future scenarios, interactions, and visual expressions."), art: "concept" },
    { id: "design-cases", title: t("设计案例", "Design Cases"), description: t("沉淀具有参考价值的实践案例，记录问题、过程、判断与最终结果。", "Document useful cases from the initial problem through decisions and final outcomes."), art: "cases" },
  ] },
  ai: { eyebrow: "AI FOR DESIGN", title: t("AI Design", "AI Design"), description: t("系统整理 AI 在设计工作中的使用方法、实践流程与基础知识，帮助团队安全、有效且有判断地使用 AI。", "Methods, workflows, and knowledge for using AI in design safely, effectively, and with sound judgment."), modules: [
    { id: "ai-workflow", title: t("AI 设计工作流", "AI Design Workflow"), description: t("将 AI 应用于研究、构思、原型、内容生成和设计评审等关键环节。", "Apply AI across research, ideation, prototyping, content creation, and design review."), art: "workflow" },
    { id: "prompt-methods", title: t("提示词方法", "Prompt Methods"), description: t("建立清晰、可复用的提示词结构，并通过上下文和约束提高输出质量。", "Build reusable prompt structures and improve results through context and constraints."), art: "prompt" },
    { id: "ai-knowledge", title: t("AI 知识库", "AI Knowledge Base"), description: t("理解模型能力、局限、版权、隐私与质量评估等设计实践所需知识。", "Understand model capabilities, limits, copyright, privacy, and quality evaluation."), art: "knowledge" },
  ] },
};

function FeaturePage({ pageId, moduleId, language, onOpenModule }: { pageId: FeaturePageId; moduleId: string | null; language: Language; onOpenModule: (id: string) => void }) {
  const page = featurePages[pageId];
  const active = page.modules.find((module) => module.id === moduleId);
  if (active) return <main className="feature-page"><section className="feature-detail"><p>{page.eyebrow}</p><h1>{active.title[language]}</h1><span>{active.description[language]}</span><div className={`feature-detail-art feature-art-${active.art}`}><i /><i /><i /><b /></div><section><h2>{language === "en" ? "About this module" : "模块说明"}</h2><p>{language === "en" ? "This module is ready for detailed methods, examples, tools, and related resources to be added as the topic develops." : "该模块用于持续补充详细方法、案例、工具与相关资源，并可随专题内容逐步扩展。"}</p></section></section><SiteFooter language={language} onBackToTop={() => document.querySelector<HTMLElement>(".feature-page")?.scrollTo({ top: 0, behavior: "smooth" })} /></main>;
  return <main className="feature-page"><section className="feature-hero"><p>{page.eyebrow}</p><h1>{page.title[language]}</h1><span>{page.description[language]}</span></section>{pageId === "sound" && <section className="independent-module-notice"><strong>{language === "en" ? "Notice" : "说明"}</strong><p>{independentModuleNotice[language]}</p></section>}<section className="feature-grid">{page.modules.map((module) => <button className="feature-card" key={module.id} onClick={() => onOpenModule(module.id)}><div className={`feature-card-art feature-art-${module.art}`}><i /><i /><i /><b /></div><div className="feature-card-copy"><h2>{module.title[language]}</h2><p>{module.description[language]}</p><span>{language === "en" ? "Open module" : "查看模块"} →</span></div></button>)}</section><SiteFooter language={language} onBackToTop={() => document.querySelector<HTMLElement>(".feature-page")?.scrollTo({ top: 0, behavior: "smooth" })} /></main>;
}

const resourceGroups = [
  { platform: "HMI", description: t("面向座舱多屏与多模态体验的设计和制作资源。", "Assets for multiscreen and multimodal in-vehicle experiences."), libraries: [
    ["components", t("通用组件库", "General Component Library"), t("适用于 HMI 基础界面与常用交互场景的通用组件资源。", "Reusable components for foundational HMI interfaces and common interactions.")],
    ["hud", t("HUD", "HUD Library"), t("适用于抬头显示界面的组件、模板和视觉资源。", "Components, templates, and visual assets for head-up displays.")],
    ["3d", t("3D 资源库", "3D Asset Library"), t("车辆、场景、材质和功能表现所需的三维设计资源。", "3D vehicles, scenes, materials, and functional visualization assets.")],
    ["icons", t("Icon 图标库", "Icon Library"), t("覆盖通用、驾驶、车控与扩展场景的统一图标资源。", "Unified icons for general, driving, vehicle control, and extended scenarios.")],
    ["motion", t("动画库", "Motion Library"), t("系统转场、状态反馈与品牌体验所需的动画资源。", "Motion assets for transitions, state feedback, and signature experiences.")],
    ["sound", t("声音库", "Sound Library"), t("操作反馈、系统提示、告警和品牌声音资源。", "Audio assets for feedback, system cues, alerts, and brand expression.")],
  ] },
  { platform: "App", description: t("面向移动产品设计、原型和交付的共享资源。", "Shared resources for mobile product design, prototyping, and delivery."), libraries: [
    ["app-components", t("App 组件库", "App Component Library"), t("遵循移动平台习惯的基础组件、状态和交互资源。", "Mobile-native components, states, and interaction assets.")],
    ["app-icons", t("App 图标库", "App Icon Library"), t("适用于移动服务与车联功能的图标资源。", "Icons for mobile services and connected vehicle features.")],
    ["app-templates", t("页面模板库", "Screen Templates"), t("常用移动任务流程和页面布局模板。", "Templates for common mobile flows and screen layouts.")],
  ] },
  { platform: "Web", description: t("面向响应式网站和专业 Web 工具的设计资源。", "Design resources for responsive websites and professional web tools."), libraries: [
    ["web-components", t("Web 组件库", "Web Component Library"), t("支持响应式布局、键鼠操作和无障碍的组件资源。", "Accessible components for responsive layouts and keyboard or pointer input.")],
    ["web-icons", t("Web 图标库", "Web Icon Library"), t("适用于网站导航、操作和状态表达的图标资源。", "Icons for web navigation, actions, and status communication.")],
    ["web-templates", t("布局模板库", "Layout Templates"), t("网站首页、内容页和专业任务页面的响应式模板。", "Responsive templates for landing, content, and professional task pages.")],
  ] },
] as const;

function ResourcesPage({ language }: { language: Language }) {
  const download = (name: string) => window.alert(language === "en" ? `${name} is being prepared for download.` : `${name}资源正在准备中。`);
  return <main className="resources-page"><section className="resources-hero"><p>DESIGN RESOURCES</p><h1>{language === "en" ? "Design Resources" : "设计资源"}</h1><span>{language === "en" ? "A unified destination for reusable HMI, App, and Web design assets." : "集中提供 HMI、App 和 Web 的可复用设计资产，为设计与交付建立统一资源入口。"}</span></section>{resourceGroups.map((group) => <section className="resource-group" key={group.platform}><div className="resource-group-heading"><h2>{group.platform}</h2><p>{group.description[language]}</p></div><div className="resource-library-grid">{group.libraries.map(([id, title, description], index) => <article className="resource-library-card" key={id}><div className={`resource-cover resource-cover-${index % 6}`}><i /><i /><b /></div><div className="resource-library-copy"><p>{group.platform} RESOURCE</p><h3>{title[language]}</h3><span>{description[language]}</span><button type="button" onClick={() => download(title[language])}>{language === "en" ? "Download" : "下载"}<i aria-hidden="true">↓</i></button></div></article>)}</div></section>)}<SiteFooter language={language} onBackToTop={() => document.querySelector<HTMLElement>(".resources-page")?.scrollTo({ top: 0, behavior: "smooth" })} /></main>;
}

const websiteUpdates = [
  { date: "2026.09.09", title: t("HMI 框架层级重组", "HMI Framework Reorganization"), description: t("将 3D 体系移入设计语言，重组人机交互基础、系统核心框架与语音体系，新增第三方应用框架，并将设计模式同步为 4.1–4.27。", "Moved the 3D system into Design Language, reorganized interaction foundations, the core system framework, and voice system, added the third-party app framework, and synchronized design patterns as 4.1–4.27.") },
  { date: "2026.09.08", title: t("HMI 设计模式框架更新", "HMI Design Pattern Framework Update"), description: t("同步 HMI 人机交互关系与系统组成结构，新增多屏联动、充电、第三空间和辅助驾驶等章节，并将设计模式重排为 4.1–4.28。", "Updated HMI interaction relationships and system composition, added multi-screen, charging, third-space, and assisted-driving chapters, and reordered design patterns as 4.1–4.28.") },
  { date: "2026.09.04", title: t("多场景人机交互目录", "Multi-scenario Interaction Chapter"), description: t("在 HMI 人机交互基础下新增多场景人机交互，并将多用户交互顺延为 4.1.1.3。", "Added Multi-scenario Interaction under HMI Interaction Foundations and moved Multi-user Interaction to 4.1.1.3.") },
  { date: "2026.09.04", title: t("HMI 专属框架与人机区域", "HMI Framework and Human-machine Zones"), description: t("同步 HMI 专属框架的 4.1–4.25 设计模式目录，并发布人机区域章节及两张关系示意图。", "Synchronized the HMI-specific 4.1–4.25 design-pattern hierarchy and published the Chinese human-machine zones chapter with two diagrams.") },
  { date: "2026.09.03", title: t("HMI 框架与章节内容同步", "HMI Framework and Content Sync"), description: t("同步 HMI 系统层级及设计模式顺序，更新手势和 TUI 定义，并同步设计 DNA、手势、语音和 TUI 章节正文。", "Updated the HMI system hierarchy and pattern order, revised gesture and TUI definitions, and synchronized the Chinese DNA, gesture, voice, and TUI chapters.") },
  { date: "2026.08.26", title: t("产品规范与资源架构更新", "Product Guidelines and Resources"), description: t("新增 HMI、Web、App 独立规范入口，重构 HMI 章节层级，并将设计资源独立为网站一级模块。", "Added separate HMI, Web, and App guidelines, refined the HMI hierarchy, and promoted resources to a top-level module.") },
  { date: "2026.08.08", title: t("主页与专题模块", "Homepage and Topic Modules"), description: t("新增独立主页、探索、AI 专题及统一卡片式内容入口。", "Added the standalone homepage, Explore, AI Topics, and unified card-based entry points.") },
  { date: "2026.08.07", title: t("章节内容同步", "Content Synchronization"), description: t("同步 overview、设计原则和 HMI 设计原则等章节细节内容。", "Synchronized detailed content for overview and HMI design principles.") },
  { date: "2026.08.06", title: t("框架结构重构", "Framework Restructure"), description: t("建立设计原则、设计语言、设计模式、设计组件、设计资源和其他内容的基础框架。", "Established the foundational structure for principles, language, patterns, components, resources, and supporting content.") },
];

function UpdatesPage({ language }: { language: Language }) {
  return <main className="updates-page"><section className="updates-hero"><p>CHANGELOG</p><h1>{language === "en" ? "Updates" : "更新"}</h1><span>{language === "en" ? "Follow changes to the Design System framework, website experience, and published guidance." : "持续记录 Design System 框架、网站体验和规范内容的重要变化。"}</span></section><section className="updates-list">{websiteUpdates.map((update) => <article key={`${update.date}-${update.title.zh}`}><time>{update.date}</time><div><h2>{update.title[language]}</h2><p>{update.description[language]}</p></div></article>)}</section><SiteFooter language={language} onBackToTop={() => document.querySelector<HTMLElement>(".updates-page")?.scrollTo({ top: 0, behavior: "smooth" })} /></main>;
}

function SiteFooter({ language, onBackToTop }: { language: Language; onBackToTop: () => void }) {
  return <footer className="site-footer"><div className="footer-brand"><BrandGlyph /><strong>Design System</strong></div><button onClick={onBackToTop}>{language === "en" ? "Back to top ↑" : "返回顶部 ↑"}</button><p>{language === "en" ? "A shared foundation for coherent product experiences." : "为一致而出色的产品体验建立共同基础。"}</p></footer>;
}

function PlatformGuidelinesPage({ platform, language }: { platform: "Web" | "App"; language: Language }) {
  const prefix = platform.toLowerCase();
  const structure = platform === "Web" ? [
    ["principles", "设计原则", "定义响应式、可访问性与高效操作等 Web 体验原则。"], ["language", "设计语言", "定义 Web 产品的品牌、字体、色彩、图标与布局表达。"], ["patterns", "设计模式", "沉淀导航、表单、数据展示和响应式布局等常用模式。"], ["components", "设计组件", "收录适用于 Web 产品的界面组件和使用规范。"],
  ] : [
    ["principles", "设计原则", "定义移动优先、平台适配与服务连续性等 App 体验原则。"], ["language", "设计语言", "定义 App 产品的品牌、字体、色彩、图标与布局表达。"], ["patterns", "设计模式", "沉淀导航、权限、通知和跨端任务等常用模式。"], ["components", "设计组件", "收录适用于 App 产品的界面组件和使用规范。"],
  ];
  const pages = useMemo(() => {
    const result: Record<string, ModulePage> = {};
    result[`${prefix}-explanation`] = { eyebrow: `${platform.toUpperCase()} GUIDELINES`, title: "说明", accent: "#d97706", lead: independentModuleNotice.zh, items: [], noteTitle: "模块状态", note: independentModuleNotice.zh };
    result[`${prefix}-overview`] = { eyebrow: `${platform.toUpperCase()} GUIDELINES`, title: `${platform} Guidelines`, accent: "#168fe5", lead: `面向 ${platform} 产品的设计规划与规范，用于建立一致、易用且具有品牌识别度的产品体验。`, items: structure.map(([id, title, body], index) => item(String(index + 3), title, body)), noteTitle: "规范规划", note: "各章节将随平台设计工作持续补充。" };
    structure.forEach(([id, title, body], index) => { result[`${prefix}-${id}`] = { eyebrow: `${platform.toUpperCase()} GUIDELINES`, title, accent: ["#18a66a", "#695cff", "#00a0a8", "#ff7849"][index], lead: body, items: [item("FOUNDATION", "基础定义", `明确 ${title} 的范围、目标和平台约束。`), item("GUIDANCE", "设计指导", `沉淀 ${platform} 场景下可执行的设计方法和判断标准。`), item("EXAMPLES", "案例与资源", "通过案例、模板和资源帮助团队理解并落地规范。")], noteTitle: "建设状态", note: "本章节已建立基础结构，可持续补充正式规范内容。" }; });
    return result;
  }, [platform, prefix]);
  const nav = useMemo<NavNode[]>(() => [{ id: `${prefix}-explanation`, label: "1. 说明", body: independentModuleNotice.zh, accent: "#d97706" }, { id: `${prefix}-overview`, label: "2. overview", body: pages[`${prefix}-overview`].lead, accent: "#168fe5" }, ...structure.map(([id, title, body], index) => ({ id: `${prefix}-${id}`, label: `${index + 3}. ${title}`, body, accent: pages[`${prefix}-${id}`].accent }))], [pages, prefix]);
  const [active, setActive] = useState(`${prefix}-explanation`);
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<Set<ModuleId>>(() => new Set());
  const [menuOpen, setMenuOpen] = useState(false);
  const content = useRef<HTMLElement>(null);
  const path = findNodePath(nav, active);
  const matches = nav.filter((node) => localizedNodeLabel(node.label, language).toLowerCase().includes(query.toLowerCase()));
  const select = (id: string) => { setActive(id); setQuery(""); setMenuOpen(false); requestAnimationFrame(() => content.current?.scrollTo({ top: 0, behavior: "smooth" })); };
  return <>
    <div className="doc-header"><div className="doc-header-inner"><button className="mobile-directory-toggle" type="button" aria-label={language === "en" ? "Open directory" : "打开目录"} aria-expanded={menuOpen} onClick={() => setMenuOpen((value) => !value)}><i aria-hidden="true"><span /><span /><span /></i></button><nav className="doc-breadcrumb"><span><button onClick={() => select(`${prefix}-explanation`)}>{platform}</button></span>{path.map((node) => <span key={node.id}><i>›</i><button className={node.id === active ? "current" : ""} onClick={() => select(node.id)}>{localizedNodeLabel(node.label, language)}</button></span>)}</nav></div></div>
    <div className="workspace"><aside className={`sidebar ${menuOpen ? "open" : ""}`}><div className="sidebar-inner"><div className="search-wrap"><span className="search-icon" /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={language === "en" ? "Search all levels" : "筛选全部层级"} />{query && <div className="search-results">{matches.length ? matches.map((node) => <button key={node.id} onClick={() => select(node.id)}><span>{localizedNodeLabel(node.label, language)}</span></button>) : <p>{language === "en" ? "No matching content" : "未找到匹配内容"}</p>}</div>}</div><nav className="sidebar-nav tree-nav">{nav.map((node) => <TreeNavItem key={node.id} node={node} depth={0} activeModule={active} expanded={expanded} language={language} onSelect={select} onToggle={(id) => setExpanded((current) => { const next = new Set(current); if (next.has(id)) next.delete(id); else next.add(id); return next; })} />)}</nav></div></aside>{menuOpen && <button className="sidebar-scrim" aria-label={language === "en" ? "Close directory" : "关闭目录"} onClick={() => setMenuOpen(false)} />}<main className="content" ref={content}><div key={`${active}-${language}`} className="module-view"><DetailModule page={pages[active]} language={language} isTopLevel={path.length === 1} onSelect={select} /></div><SiteFooter language={language} onBackToTop={() => content.current?.scrollTo({ top: 0, behavior: "smooth" })} /></main></div>
  </>;
}

export function DesignSystemPage() {
  const [sitePage, setSitePage] = useState<"home" | "hmi" | "web" | "app" | "resources" | "updates" | FeaturePageId>("home");
  const [featureModule, setFeatureModule] = useState<string | null>(null);
  const [activeModule, setActiveModule] = useState<ModuleId>("explanation");
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [language, setLanguage] = useState<Language>("zh");
  const [languageOpen, setLanguageOpen] = useState(false);
  const [expanded, setExpanded] = useState<Set<ModuleId>>(() => new Set(expandableIds));
  useEffect(() => {
    document.documentElement.dataset.language = language;
  }, [language]);
  const contentRef = useRef<HTMLElement>(null);
  const matches = useMemo(() => { const keyword = query.trim().toLowerCase(); if (!keyword) return []; return allNavItems.filter((entry) => `${entry.label} ${localizedNodeLabel(entry.label, language)} ${modulePages[entry.id].title} ${modulePages[entry.id].eyebrow}`.toLowerCase().includes(keyword)).slice(0, 9); }, [query, language]);
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
  const openGuidelines = (id: ModuleId = "explanation") => {
    setSitePage("hmi");
    selectModule(id);
  };
  const openFeaturePage = (page: FeaturePageId) => { setFeatureModule(null); setSitePage(page); setMenuOpen(false); };
  const toggleNode = (id: ModuleId) => setExpanded((current) => { const next = new Set(current); if (next.has(id)) next.delete(id); else next.add(id); return next; });
  const activePath = findNodePath(navigation, activeModule);
  const activeRootId = activePath[0]?.id;

  return <div className="site-shell">
    <header className="global-header"><div className="global-header-inner"><button className="menu-toggle" aria-expanded={mobileNavOpen} aria-label={language === "en" ? "Toggle navigation" : "切换导航"} onClick={() => setMobileNavOpen((value) => !value)}><span /><span /><span /></button><button className="brand brand-button" onClick={() => setSitePage("home")} aria-label="Design System"><BrandGlyph /><span>Design System</span></button><nav className="global-nav" aria-label={language === "en" ? "Global navigation" : "全局导航"}><button className={sitePage === "home" ? "active" : ""} onClick={() => setSitePage("home")}>Home</button><button className={sitePage === "hmi" ? "active" : ""} onClick={() => openGuidelines("explanation")}>HMI</button><button className={sitePage === "web" ? "active" : ""} onClick={() => setSitePage("web")}>Web</button><button className={sitePage === "app" ? "active" : ""} onClick={() => setSitePage("app")}>App</button><button className={sitePage === "sound" ? "active" : ""} onClick={() => openFeaturePage("sound")}>Sound Library</button><button className={sitePage === "ai" ? "active" : ""} onClick={() => openFeaturePage("ai")}>AI Design</button><button className={sitePage === "explore" ? "active" : ""} onClick={() => openFeaturePage("explore")}>Explore</button><button className={sitePage === "resources" ? "active" : ""} onClick={() => setSitePage("resources")}>Resources</button><button className={sitePage === "updates" ? "active" : ""} onClick={() => setSitePage("updates")}>Updates</button></nav><div className="header-actions"><button className="header-icon search-shortcut" aria-label={language === "en" ? "Open search" : "打开搜索"} onClick={() => { setSitePage("hmi"); requestAnimationFrame(() => document.getElementById("site-search")?.focus()); }} /><div className="language-switcher"><button className="language-trigger" aria-haspopup="menu" aria-expanded={languageOpen} onClick={() => setLanguageOpen((value) => !value)}>{language === "zh" ? "中文" : "English"}<span aria-hidden="true">⌄</span></button>{languageOpen && <div className="language-menu" role="menu"><button className={language === "zh" ? "selected" : ""} role="menuitem" onClick={() => { setLanguage("zh"); setLanguageOpen(false); }}>中文</button><button className={language === "en" ? "selected" : ""} role="menuitem" onClick={() => { setLanguage("en"); setLanguageOpen(false); }}>English</button></div>}</div></div></div></header>
    {mobileNavOpen && <nav className="mobile-global-nav" aria-label={language === "en" ? "Mobile navigation" : "移动端导航"}><button onClick={() => { setSitePage("home"); setMobileNavOpen(false); }}>Home</button><button onClick={() => { openGuidelines("explanation"); setMobileNavOpen(false); }}>HMI</button><button onClick={() => { setSitePage("web"); setMobileNavOpen(false); }}>Web</button><button onClick={() => { setSitePage("app"); setMobileNavOpen(false); }}>App</button><button onClick={() => { openFeaturePage("sound"); setMobileNavOpen(false); }}>Sound Library</button><button onClick={() => { openFeaturePage("ai"); setMobileNavOpen(false); }}>AI Design</button><button onClick={() => { openFeaturePage("explore"); setMobileNavOpen(false); }}>Explore</button><button onClick={() => { setSitePage("resources"); setMobileNavOpen(false); }}>Resources</button><button onClick={() => { setSitePage("updates"); setMobileNavOpen(false); }}>Updates</button>{sitePage === "hmi" && <button className="mobile-directory-link" onClick={() => { setMenuOpen(true); setMobileNavOpen(false); }}>{language === "en" ? "Open HMI directory" : "打开 HMI 章节目录"}</button>}</nav>}
    {sitePage === "home" ? <HomePage language={language} onOpenPlatform={(platform) => platform === "hmi" ? openGuidelines("explanation") : setSitePage(platform)} onOpenFeature={(page, module) => { setFeatureModule(module); setSitePage(page); }} /> : sitePage === "sound" || sitePage === "explore" || sitePage === "ai" ? <FeaturePage pageId={sitePage} moduleId={featureModule} language={language} onOpenModule={setFeatureModule} /> : sitePage === "resources" ? <ResourcesPage language={language} /> : sitePage === "updates" ? <UpdatesPage language={language} /> : sitePage === "web" || sitePage === "app" ? <PlatformGuidelinesPage key={sitePage} platform={sitePage === "web" ? "Web" : "App"} language={language} /> : <>
    <div className="doc-header"><div className="doc-header-inner"><button className="mobile-directory-toggle" type="button" aria-label={language === "en" ? "Open directory" : "打开目录"} aria-expanded={menuOpen} onClick={() => setMenuOpen((value) => !value)}><i aria-hidden="true"><span /><span /><span /></i></button><nav className="doc-breadcrumb" aria-label={language === "en" ? "Current section path" : "当前章节路径"}><span><button onClick={() => openGuidelines("explanation")}>HMI</button></span>{activePath.map((node) => <span key={node.id}><i aria-hidden="true">›</i><button className={node.id === activeModule ? "current" : ""} onClick={() => selectModule(node.id)}>{localizedNodeLabel(node.label, language)}</button></span>)}</nav></div></div>
    <div className="workspace"><aside className={`sidebar ${menuOpen ? "open" : ""}`}><div className="sidebar-inner"><div className="search-wrap"><span className="search-icon" aria-hidden="true" /><input id="site-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={language === "en" ? "Search all levels" : "筛选全部层级"} aria-label={language === "en" ? "Search framework" : "筛选全部框架层级"} autoComplete="off" />{query && <div className="search-results" role="listbox">{matches.length ? matches.map((entry) => <button key={entry.id} onClick={() => selectModule(entry.id)}><span>{localizedNodeLabel(entry.label, language)}</span><small>{cleanKicker(modulePages[entry.id].eyebrow)}</small></button>) : <p>{language === "en" ? "No matching content" : "未找到匹配内容"}</p>}</div>}</div><nav className="sidebar-nav tree-nav" aria-label={language === "en" ? "Framework hierarchy" : "完整框架目录"}>{navigation.map((node) => <TreeNavItem key={node.id} node={node} depth={0} activeModule={activeModule} expanded={expanded} language={language} onSelect={selectModule} onToggle={toggleNode} />)}</nav><div className="sidebar-foot"><span>{language === "en" ? "Website status" : "网站同步状态"}</span><strong className="sync-status">{language === "en" ? "Updated" : "已更新"}</strong></div></div></aside>
      {menuOpen && <button className="sidebar-scrim" aria-label="关闭目录" onClick={() => setMenuOpen(false)} />}
      <main className="content" ref={contentRef} tabIndex={-1} aria-live="polite"><div key={`${activeModule}-${language}`} className="module-view"><DetailModule page={modulePages[activeModule]} language={language} isTopLevel={activePath.length === 1} onSelect={selectModule} /></div><SiteFooter language={language} onBackToTop={() => contentRef.current?.scrollTo({ top: 0, behavior: "smooth" })} /></main>
    </div></>}
  </div>;
}
