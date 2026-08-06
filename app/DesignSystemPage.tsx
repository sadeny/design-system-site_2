"use client";

import { useMemo, useState } from "react";

const navigation = [
  { group: "概览", items: ["首页", "系统总则", "设计原则"] },
  { group: "设计语言", items: ["品牌规范", "设计基础", "通用体验规范"] },
  { group: "构建体验", items: ["组件", "交互模式", "页面模板"] },
  { group: "终端", items: ["智能座舱 HMI", "Mobile App", "Web / PC"] },
  { group: "交付与管理", items: ["设计资源", "授权与协作", "管理与治理"] },
];

const foundations = [
  { name: "色彩", en: "Color", tone: "indigo", mark: "color" },
  { name: "排版", en: "Typography", tone: "blue", mark: "type" },
  { name: "布局", en: "Layout", tone: "cyan", mark: "layout" },
  { name: "动效", en: "Motion", tone: "violet", mark: "motion" },
  { name: "无障碍", en: "Accessibility", tone: "green", mark: "access" },
  { name: "设计令牌", en: "Design tokens", tone: "orange", mark: "token" },
];

const updates = [
  {
    eyebrow: "NEW · HMI",
    title: "驾驶分心控制",
    body: "建立行驶与驻车状态下的任务边界、信息优先级与交互约束。",
    className: "update-safety",
    art: "safety",
  },
  {
    eyebrow: "UPDATED · FOUNDATIONS",
    title: "日间与夜间模式",
    body: "以语义令牌统一不同光照环境下的可读性、对比度与品牌表达。",
    className: "update-theme",
    art: "theme",
  },
  {
    eyebrow: "NEW · COMPONENTS",
    title: "多模态反馈",
    body: "协调视觉、声音、触觉与语音反馈，让系统状态始终清晰可感知。",
    className: "update-signal",
    art: "signal",
  },
];

const topics = [
  {
    title: "开始使用",
    body: "了解系统定位、核心原则与不同角色的接入路径。",
    meta: "Getting started",
    accent: "#00a3ff",
    icon: "start",
  },
  {
    title: "设计基础",
    body: "用统一的色彩、字体、布局、动效与令牌构建一致体验。",
    meta: "Foundations",
    accent: "#695cff",
    icon: "foundation",
  },
  {
    title: "组件",
    body: "了解可复用界面单元的构成、状态、行为与跨终端适配。",
    meta: "Components",
    accent: "#ff7a45",
    icon: "components",
  },
  {
    title: "交互模式",
    body: "为搜索、反馈、设置、确认等完整任务提供一致的解决方案。",
    meta: "Patterns",
    accent: "#18a66a",
    icon: "patterns",
  },
  {
    title: "终端规范",
    body: "在集团公共规则上，适配 HMI、Mobile 与 Web / PC 场景。",
    meta: "Platforms",
    accent: "#ee3b6a",
    icon: "platforms",
  },
  {
    title: "资源与治理",
    body: "获取设计资产、检查清单，并了解授权实施、贡献、发布与迁移机制。",
    meta: "Resources & governance",
    accent: "#8a5cf5",
    icon: "resources",
  },
];

const collaborationStages = [
  {
    step: "01",
    title: "集团公共基线",
    body: "集团定义必须统一项、品牌默认、开放扩展点、设计资源与验收标准。",
  },
  {
    step: "02",
    title: "本地需求归纳",
    body: "子公司、合资公司或合作公司结合市场、车型、业务与技术条件明确本地需求。",
  },
  {
    step: "03",
    title: "设计研发落地",
    body: "授权实施方的产品、设计与研发团队共同完成方案、开发、验证和交付。",
  },
  {
    step: "04",
    title: "成果评审回流",
    body: "差异项接受联合评审；可复用组件、模式、模板与验证结论回流公共体系。",
  },
];

const searchable = [
  ...foundations.map((item) => ({ title: item.name, meta: item.en, id: "foundations" })),
  ...topics.map((item) => ({ title: item.title, meta: item.meta, id: "topics" })),
  ...updates.map((item) => ({ title: item.title, meta: item.eyebrow, id: "updates" })),
  { title: "授权与协作", meta: "集团与实施方联合交付", id: "collaboration" },
];

function VisualMark({ type }: { type: string }) {
  return <span className={`visual-mark visual-mark-${type}`} aria-hidden="true"><i /><b /><em /></span>;
}

export function DesignSystemPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");

  const matches = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return [];
    return searchable.filter((item) => `${item.title} ${item.meta}`.toLowerCase().includes(keyword)).slice(0, 6);
  }, [query]);

  const jumpTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setQuery("");
  };

  return (
    <div className="site-shell">
      <header className="global-header">
        <div className="global-header-inner">
          <a className="brand" href="#top" aria-label="Atlas Design System 首页">
            <span className="brand-glyph" aria-hidden="true"><i /><i /><i /></span>
            <span>Atlas</span>
          </a>
          <nav className="global-nav" aria-label="全局导航">
            <a className="active" href="#top">设计</a>
            <a href="#topics">开发</a>
            <a href="#resources">资源</a>
            <a href="#governance">社区</a>
          </nav>
          <div className="header-actions">
            <button className="header-icon search-shortcut" aria-label="打开搜索" onClick={() => document.getElementById("site-search")?.focus()} />
            <a className="version-pill" href="#governance">Stable 1.0</a>
            <button className="menu-toggle" aria-expanded={menuOpen} aria-label="切换目录" onClick={() => setMenuOpen((value) => !value)}>
              <span /><span />
            </button>
          </div>
        </div>
      </header>

      <div className="doc-header">
        <div className="doc-header-inner">
          <a href="#top" className="doc-title">Design System</a>
          <span className="doc-divider" />
          <span className="doc-context">集团体验规范</span>
        </div>
      </div>

      <div className="workspace" id="top">
        <aside className={`sidebar ${menuOpen ? "open" : ""}`}>
          <div className="sidebar-inner">
            <div className="search-wrap">
              <span className="search-icon" aria-hidden="true" />
              <input
                id="site-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="筛选规范"
                aria-label="筛选规范"
                autoComplete="off"
              />
              {query && (
                <div className="search-results" role="listbox">
                  {matches.length ? matches.map((item) => (
                    <button key={`${item.id}-${item.title}`} onClick={() => jumpTo(item.id)}>
                      <span>{item.title}</span><small>{item.meta}</small>
                    </button>
                  )) : <p>未找到匹配内容</p>}
                </div>
              )}
            </div>
            <nav className="sidebar-nav" aria-label="规范目录">
              {navigation.map((section) => (
                <div className="nav-group" key={section.group}>
                  <p>{section.group}</p>
                  {section.items.map((item) => (
                    <a key={item} className={item === "首页" ? "current" : ""} href={item === "首页" ? "#top" : item.includes("设计基础") ? "#foundations" : item.includes("协作") ? "#collaboration" : item.includes("治理") ? "#governance" : "#topics"} onClick={() => setMenuOpen(false)}>
                      {item}
                    </a>
                  ))}
                </div>
              ))}
            </nav>
            <div className="sidebar-foot">
              <span>最近更新</span>
              <strong>2026.08</strong>
            </div>
          </div>
        </aside>

        {menuOpen && <button className="sidebar-scrim" aria-label="关闭目录" onClick={() => setMenuOpen(false)} />}

        <main className="content">
          <section className="hero" aria-labelledby="hero-title">
            <div className="eyebrow-row">
              <span>GROUP DESIGN LANGUAGE</span>
              <span className="status-dot">当前稳定版</span>
            </div>
            <h1 id="hero-title">Design System</h1>
            <p className="hero-lead">一套面向集团及授权实施方的设计指导与规范体系，为多品牌、多产品和多终端建立共同基线，并支持子公司与合作公司在清晰边界内完成产品迭代。</p>

            <div className="principle-grid">
              <article className="principle-card">
                <div className="principle-art principle-art-safe" aria-hidden="true">
                  <span className="safe-orbit" /><span className="safe-core">✓</span>
                </div>
                <div><h2>安全可信</h2><p>在所有场景中优先保障驾驶安全、隐私与关键任务。</p></div>
              </article>
              <article className="principle-card">
                <div className="principle-art principle-art-clear" aria-hidden="true">
                  <span /><span /><span />
                </div>
                <div><h2>清晰可达</h2><p>用准确的信息、明确的层级和可感知的反馈降低认知负担。</p></div>
              </article>
              <article className="principle-card">
                <div className="principle-art principle-art-consistent" aria-hidden="true">
                  <span /><span /><span />
                </div>
                <div><h2>一致可预期</h2><p>跨品牌与终端保持稳定认知，在统一基础上适配真实场景。</p></div>
              </article>
            </div>
          </section>

          <section className="section-block" id="foundations">
            <div className="section-heading">
              <div><p className="section-kicker">FOUNDATIONS</p><h2>设计基础</h2></div>
              <p>从语义化令牌出发，让品牌、主题、密度与终端差异都能被清晰管理。</p>
            </div>
            <div className="foundation-grid">
              {foundations.map((item) => (
                <a className={`foundation-item tone-${item.tone}`} href="#topics" key={item.name}>
                  <VisualMark type={item.mark} />
                  <span><strong>{item.name}</strong><small>{item.en}</small></span>
                  <i className="arrow" aria-hidden="true">↗</i>
                </a>
              ))}
            </div>
          </section>

          <section className="section-block" id="updates">
            <div className="section-heading compact">
              <div><p className="section-kicker">WHAT’S NEW</p><h2>新增与更新</h2></div>
              <a className="text-link" href="#governance">查看版本记录 <span>→</span></a>
            </div>
            <div className="update-grid">
              {updates.map((item) => (
                <a className={`update-card ${item.className}`} href="#topics" key={item.title}>
                  <div className={`update-art update-art-${item.art}`} aria-hidden="true"><i /><b /><span /></div>
                  <div className="update-copy"><p>{item.eyebrow}</p><h3>{item.title}</h3><span>{item.body}</span></div>
                </a>
              ))}
            </div>
          </section>

          <section className="section-block" id="topics">
            <div className="section-heading">
              <div><p className="section-kicker">EXPLORE</p><h2>浏览主题</h2></div>
              <p>从原则到资源，按工作任务快速找到需要的规范与实践指导。</p>
            </div>
            <div className="topic-grid">
              {topics.map((item) => (
                <a className="topic-card" href={item.title === "资源与治理" ? "#resources" : "#foundations"} key={item.title} style={{ "--topic-accent": item.accent } as React.CSSProperties}>
                  <div className={`topic-icon topic-icon-${item.icon}`} aria-hidden="true"><i /><b /><span /></div>
                  <p>{item.meta}</p>
                  <h3>{item.title}</h3>
                  <span>{item.body}</span>
                  <i className="topic-arrow" aria-hidden="true">→</i>
                </a>
              ))}
            </div>
          </section>

          <section className="platform-section" id="resources">
            <div className="platform-copy">
              <p className="section-kicker">ONE SYSTEM · THREE PLATFORMS</p>
              <h2>同一种语言，适配每一种场景。</h2>
              <p>集团公共规则提供一致的认知基础，HMI、Mobile App 与 Web / PC 在输入方式、环境与任务特征上进行受控适配。HMI 的具体产品由授权实施方结合本地需求完成设计与研发落地。</p>
              <a className="primary-link" href="#topics">探索终端规范 <span>→</span></a>
            </div>
            <div className="device-stage" aria-label="HMI、手机与桌面端界面示意">
              <div className="device device-hmi"><div className="device-ui"><span /><span /><i /><b /></div></div>
              <div className="device device-phone"><div className="device-ui"><span /><span /><i /><b /></div></div>
              <div className="device device-web"><div className="device-ui"><span /><span /><i /><b /></div></div>
            </div>
          </section>

          <section className="section-block collaboration-section" id="collaboration">
            <div className="section-heading">
              <div><p className="section-kicker">AUTHORIZED DELIVERY</p><h2>共同定义，共同落地。</h2></div>
              <p>Design System 不是单向下发的成品方案。集团守住公共基线，授权实施方负责真实产品的需求、设计、研发与验证，双方通过评审和贡献机制持续演进。</p>
            </div>
            <div className="collaboration-flow">
              {collaborationStages.map((stage, index) => (
                <article className="collaboration-card" key={stage.step}>
                  <div className="collaboration-step"><span>{stage.step}</span>{index < collaborationStages.length - 1 && <i aria-hidden="true">→</i>}</div>
                  <h3>{stage.title}</h3>
                  <p>{stage.body}</p>
                </article>
              ))}
            </div>
            <div className="collaboration-note">
              <strong>责任边界</strong>
              <span>集团负责公共规范、开放边界和最终差异评审；授权实施方对本地需求归纳、体验设计、研发实现和验证结果负责。</span>
            </div>
          </section>

          <footer id="governance">
            <div className="footer-brand"><span className="brand-glyph"><i /><i /><i /></span><strong>Atlas Design System</strong></div>
            <div className="footer-meta"><span>Stable 1.0</span><span>最后更新 2026.08.06</span><a href="#top">返回顶部 ↑</a></div>
            <p>以当前稳定版本作为集团与授权实施方开展体验设计、研发落地、验证和持续演进的共同基线。</p>
          </footer>
        </main>
      </div>
    </div>
  );
}
