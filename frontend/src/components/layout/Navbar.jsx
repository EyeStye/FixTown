// import { useState, useEffect } from "react";
// import { Link, useLocation } from "react-router-dom";

// const MapIcon = () => (
//   <svg
//     width="16"
//     height="16"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//   >
//     <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
//     <line x1="9" y1="3" x2="9" y2="18" />
//     <line x1="15" y1="6" x2="15" y2="21" />
//   </svg>
// );

// const PlusIcon = () => (
//   <svg
//     width="16"
//     height="16"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2.5"
//     strokeLinecap="round"
//   >
//     <line x1="12" y1="5" x2="12" y2="19" />
//     <line x1="5" y1="12" x2="19" y2="12" />
//   </svg>
// );

// const BellIcon = ({ hasUnread }) => (
//   <div style={{ position: "relative" }}>
//     <svg
//       width="18"
//       height="18"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     >
//       <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
//       <path d="M13.73 21a2 2 0 0 1-3.46 0" />
//     </svg>
//     {hasUnread && (
//       <span
//         style={{
//           position: "absolute",
//           top: "-3px",
//           right: "-3px",
//           width: "8px",
//           height: "8px",
//           borderRadius: "50%",
//           background: "var(--amber-500)",
//           boxShadow: "0 0 6px var(--amber-400)",
//           animation: "pulse-glow 2s infinite",
//         }}
//       />
//     )}
//   </div>
// );

// const UserIcon = () => (
//   <svg
//     width="16"
//     height="16"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//   >
//     <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
//     <circle cx="12" cy="7" r="4" />
//   </svg>
// );

// const MenuIcon = () => (
//   <svg
//     width="22"
//     height="22"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2"
//     strokeLinecap="round"
//   >
//     <line x1="3" y1="6" x2="21" y2="6" />
//     <line x1="3" y1="12" x2="21" y2="12" />
//     <line x1="3" y1="18" x2="21" y2="18" />
//   </svg>
// );

// const CloseIcon = () => (
//   <svg
//     width="22"
//     height="22"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2"
//     strokeLinecap="round"
//   >
//     <line x1="18" y1="6" x2="6" y2="18" />
//     <line x1="6" y1="6" x2="18" y2="18" />
//   </svg>
// );

// const SignInIcon = () => (
//   <svg
//     width="16"
//     height="16"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//   >
//     <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
//     <polyline points="10 17 15 12 10 7" />
//     <line x1="15" y1="12" x2="3" y2="12" />
//   </svg>
// );

// export default function Navbar() {
//   const [scrolled, setScrolled] = useState(false);
//   const [menuOpen, setMenuOpen] = useState(false);
//   const location = useLocation();

//   // Mock: no auth yet (Step 2 will wire this)
//   const user = null;

//   useEffect(() => {
//     const onScroll = () => setScrolled(window.scrollY > 20);
//     window.addEventListener("scroll", onScroll, { passive: true });
//     return () => window.removeEventListener("scroll", onScroll);
//   }, []);

//   useEffect(() => {
//     setMenuOpen(false);
//   }, [location]);

//   const navLinks = [
//     { to: "/map", label: "Explore Map", icon: <MapIcon /> },
//     { to: "/report", label: "Report Issue", icon: <PlusIcon /> },
//   ];

//   const isActive = (path) => location.pathname === path;

//   return (
//     <>
//       <nav
//         style={{
//           position: "fixed",
//           top: 0,
//           left: 0,
//           right: 0,
//           zIndex: "var(--z-navbar)",
//           height: "64px",
//           display: "flex",
//           alignItems: "center",
//           padding: "0 24px",
//           background: scrolled
//             ? "rgba(18, 20, 23, 0.53)"
//             : "rgba(19, 20, 24, 0.23)",
//           backdropFilter: "blur(16px)",
//           WebkitBackdropFilter: "blur(16px)",
//           borderBottom: `1px solid ${scrolled ? "rgba(255,255,255,0.08)" : "transparent"}`,
//           transition: "all 0.3s var(--ease-out)",
//         }}
//       >
//         {/* Logo */}
//         <Link
//           to="/"
//           style={{
//             display: "flex",
//             alignItems: "center",
//             gap: "10px",
//             textDecoration: "none",
//             marginRight: "auto",
//           }}
//         >
//           {/* Logomark */}
//           <img
//             src="./logo.svg"
//             alt="FixTown"
//             style={{ width: "36px", height: "36px", flexShrink: 0 }}
//           />
//           <span className="brand-text"
//             style={{
//               fontSize: "1.2rem",
//               fontWeight: "800",
//               letterSpacing: "-0.03em",
//               color: "var(--text-primary)",
//             }}
//           >
//             Fix<span style={{ color: "var(--amber-500)" }}>Town</span>
//           </span>
//         </Link>

//         {/* Desktop Nav */}
//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             gap: "10px",
//           }}
//           className="desktop-nav"
//         >
//           {[
//             ...navLinks,
//             { to: "/login", label: "Sign In", icon: <SignInIcon /> },
//           ].map((link) => (
//             <Link
//               key={link.to}
//               to={link.to}
//               className="nav-pill"
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "0px",
//                 padding: "8px",
//                 borderRadius: "var(--radius-full)",
//                 fontSize: "0.875rem",
//                 fontWeight: "500",
//                 color: isActive(link.to)
//                   ? "var(--amber-400)"
//                   : "var(--text-secondary)",
//                 background: isActive(link.to)
//                   ? "rgba(251,191,36,0.1)"
//                   : "rgba(255,255,255,0.05)",
//                 border: `1px solid ${isActive(link.to) ? "rgba(251,191,36,0.2)" : "rgba(255,255,255,0.07)"}`,
//                 textDecoration: "none",
//                 overflow: "hidden",
//                 maxWidth: "32px",
//                 height: "32px",
//                 minWidth: "32px",
//                 justifyContent: "center",
//                 transition:
//                   "max-width 0.5s cubic-bezier(0.16,1,0.3,1), background 0.15s, color 0.15s, border-color 0.15s, padding 0.5s cubic-bezier(0.16,1,0.3,1)",
//                 whiteSpace: "nowrap",
//               }}
//               onMouseEnter={(e) => {
//                 e.currentTarget.style.maxWidth = "160px";
//                 e.currentTarget.style.minWidth = "32px";
//                 e.currentTarget.style.padding = "8px 14px";
//                 e.currentTarget.style.gap = "6px";
//                 e.currentTarget.style.justifyContent = "flex-start";
//                 e.currentTarget.querySelector("span:last-child").style.opacity =
//                   "1";
//                 if (!isActive(link.to)) {
//                   e.currentTarget.style.color = "var(--text-primary)";
//                   e.currentTarget.style.background = "rgba(255,255,255,0.1)";
//                   e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
//                 }
//               }}
//               onMouseLeave={(e) => {
//                 e.currentTarget.style.maxWidth = "32px";
//                 e.currentTarget.style.minWidth = "32px";
//                 e.currentTarget.style.padding = "8px";
//                 e.currentTarget.style.gap = "0px";
//                 e.currentTarget.style.justifyContent = "center";
//                 e.currentTarget.querySelector("span:last-child").style.opacity =
//                   "0";
//                 if (!isActive(link.to)) {
//                   e.currentTarget.style.color = "var(--text-secondary)";
//                   e.currentTarget.style.background = "rgba(255,255,255,0.05)";
//                   e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
//                 }
//               }}
//             >
//               <span
//                 style={{ flexShrink: 0, display: "flex", alignItems: "center" }}
//               >
//                 {link.icon}
//               </span>
//               <span
//                 style={{
//                   fontSize: "0.875rem",
//                   overflow: "hidden",
//                   opacity: 0,
//                   transition: "opacity 0.3s ease 0.1s",
//                 }}
//               >
//                 {link.label}
//               </span>
//             </Link>
//           ))}
//         </div>

//         {/* Right side */}
//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             gap: "8px",
//             marginLeft: "16px",
//           }}
//         >
//           {user ? (
//             <>
//               <button className="btn btn-ghost" style={{ padding: "8px" }}>
//                 <BellIcon hasUnread={true} />
//               </button>
//               <Link to="/dashboard" className="btn btn-secondary btn-sm">
//                 <UserIcon />
//                 Dashboard
//               </Link>
//             </>
//           ) : (
//             <>
//               <Link to="/register" className="btn btn-primary btn-sm">
//                 Get Started
//               </Link>
//             </>
//           )}

//           {/* Mobile menu toggle */}
//           <button
//             onClick={() => setMenuOpen((v) => !v)}
//             style={{
//               display: "none",
//               background: "transparent",
//               border: "none",
//               color: "var(--text-primary)",
//               padding: "6px",
//               cursor: "pointer",
//             }}
//             className="mobile-menu-btn"
//             aria-label="Toggle menu"
//           >
//             {menuOpen ? <CloseIcon /> : <MenuIcon />}
//           </button>
//         </div>
//       </nav>

//       {/* Mobile Menu Drawer */}
//       {menuOpen && (
//         <div
//           style={{
//             position: "fixed",
//             top: "64px",
//             left: 0,
//             right: 0,
//             zIndex: "calc(var(--z-navbar) - 1)",
//             background: "rgba(7, 13, 26, 0.98)",
//             backdropFilter: "blur(16px)",
//             borderBottom: "1px solid var(--border-subtle)",
//             padding: "16px 24px 24px",
//             display: "flex",
//             flexDirection: "column",
//             gap: "8px",
//             animation: "fadeInUp 0.25s var(--ease-out) both",
//           }}
//         >
//           {navLinks.map((link) => (
//             <Link
//               key={link.to}
//               to={link.to}
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "10px",
//                 padding: "12px 16px",
//                 borderRadius: "var(--radius-md)",
//                 color: isActive(link.to)
//                   ? "var(--amber-400)"
//                   : "var(--text-secondary)",
//                 background: isActive(link.to)
//                   ? "rgba(251,191,36,0.1)"
//                   : "transparent",
//                 fontWeight: "500",
//                 fontSize: "0.9rem",
//                 textDecoration: "none",
//               }}
//             >
//               {link.icon} {link.label}
//             </Link>
//           ))}
//           <div
//             style={{
//               height: "1px",
//               background: "var(--border-subtle)",
//               margin: "8px 0",
//             }}
//           />
//           <Link
//             to="/login"
//             className="btn btn-secondary"
//             style={{ width: "100%", justifyContent: "center" }}
//           >
//             Sign in
//           </Link>
//           <Link
//             to="/register"
//             className="btn btn-primary"
//             style={{ width: "100%", justifyContent: "center" }}
//           >
//             Get Started
//           </Link>
//         </div>
//       )}

//       <style>{`
//         @media (max-width: 640px) {
//           .desktop-nav { display: none !important; }
//           .mobile-menu-btn { display: flex !important; }
//           .brand-text { display: none !important; }
//         }
//       `}</style>
//     </>
//   );
// }

// import { useState, useEffect } from 'react'
// import { Link, useLocation, useNavigate } from 'react-router-dom'
// import { useAuth } from '../../context/AuthContext'

// const MapIcon = () => (
//   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>
//     <line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/>
//   </svg>
// )

// const PlusIcon = () => (
//   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
//     <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
//   </svg>
// )

// const SignInIcon = () => (
//   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
//     <polyline points="10 17 15 12 10 7"/>
//     <line x1="15" y1="12" x2="3" y2="12"/>
//   </svg>
// )

// const BellIcon = ({ hasUnread }) => (
//   <div style={{ position: 'relative' }}>
//     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//       <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
//       <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
//     </svg>
//     {hasUnread && (
//       <span style={{
//         position: 'absolute', top: '-3px', right: '-3px',
//         width: '7px', height: '7px', borderRadius: '50%',
//         background: 'var(--amber-500)',
//         boxShadow: '0 0 6px var(--amber-400)',
//         animation: 'pulse-glow 2s infinite',
//       }} />
//     )}
//   </div>
// )

// const DashIcon = () => (
//   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
//     <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
//   </svg>
// )

// const LogoutIcon = () => (
//   <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
//     <polyline points="16 17 21 12 16 7"/>
//     <line x1="21" y1="12" x2="9" y2="12"/>
//   </svg>
// )

// const MenuIcon = () => (
//   <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
//     <line x1="3" y1="6" x2="21" y2="6"/>
//     <line x1="3" y1="12" x2="21" y2="12"/>
//     <line x1="3" y1="18" x2="21" y2="18"/>
//   </svg>
// )

// const CloseIcon = () => (
//   <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
//     <line x1="18" y1="6" x2="6" y2="18"/>
//     <line x1="6" y1="6" x2="18" y2="18"/>
//   </svg>
// )

// export default function Navbar() {
//   const [scrolled,     setScrolled]     = useState(false)
//   const [menuOpen,     setMenuOpen]     = useState(false)
//   const [userMenuOpen, setUserMenuOpen] = useState(false)
//   const location = useLocation()
//   const navigate = useNavigate()
//   const { user, logout } = useAuth()

//   useEffect(() => {
//     const onScroll = () => setScrolled(window.scrollY > 20)
//     window.addEventListener('scroll', onScroll, { passive: true })
//     return () => window.removeEventListener('scroll', onScroll)
//   }, [])

//   useEffect(() => { setMenuOpen(false); setUserMenuOpen(false) }, [location])

//   const navLinks = [
//     { to: '/map',    label: 'Explore Map',  icon: <MapIcon /> },
//     { to: '/report', label: 'Report Issue', icon: <PlusIcon /> },
//   ]

//   const isActive = (path) => location.pathname === path

//   const handleLogout = () => { logout(); navigate('/') }

//   // Nav pill — icon only, expands on hover
//   const NavPill = ({ to, label, icon }) => (
//     <Link
//       to={to}
//       className="nav-pill"
//       style={{
//         display: 'flex', alignItems: 'center', gap: '0px',
//         padding: '8px', borderRadius: 'var(--radius-full)',
//         fontSize: '0.875rem', fontWeight: '500',
//         color: isActive(to) ? 'var(--amber-400)' : 'var(--text-secondary)',
//         background: isActive(to) ? 'rgba(251,191,36,0.1)' : 'rgba(255,255,255,0.05)',
//         border: `1px solid ${isActive(to) ? 'rgba(251,191,36,0.2)' : 'rgba(255,255,255,0.07)'}`,
//         textDecoration: 'none', overflow: 'hidden',
//         maxWidth: '32px', height: '32px', minWidth: '32px', justifyContent: 'center',
//         transition: 'max-width 0.5s cubic-bezier(0.16,1,0.3,1), background 0.15s, color 0.15s, border-color 0.15s, padding 0.5s cubic-bezier(0.16,1,0.3,1)',
//         whiteSpace: 'nowrap',
//       }}
//       onMouseEnter={e => {
//         e.currentTarget.style.maxWidth = '160px'
//         e.currentTarget.style.minWidth = '32px'
//         e.currentTarget.style.padding = '8px 14px'
//         e.currentTarget.style.gap = '6px'
//         e.currentTarget.style.justifyContent = 'flex-start'
//         e.currentTarget.querySelector('span:last-child').style.opacity = '1'
//         if (!isActive(to)) {
//           e.currentTarget.style.color = 'var(--text-primary)'
//           e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
//           e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'
//         }
//       }}
//       onMouseLeave={e => {
//         e.currentTarget.style.maxWidth = '32px'
//         e.currentTarget.style.minWidth = '32px'
//         e.currentTarget.style.padding = '8px'
//         e.currentTarget.style.gap = '0px'
//         e.currentTarget.style.justifyContent = 'center'
//         e.currentTarget.querySelector('span:last-child').style.opacity = '0'
//         if (!isActive(to)) {
//           e.currentTarget.style.color = 'var(--text-secondary)'
//           e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
//           e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
//         }
//       }}
//     >
//       <span style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>{icon}</span>
//       <span style={{ fontSize: '0.875rem', overflow: 'hidden', opacity: 0, transition: 'opacity 0.2s ease 0.15s' }}>{label}</span>
//     </Link>
//   )

//   return (
//     <>
//       <nav style={{
//         position: 'fixed', top: 0, left: 0, right: 0,
//         zIndex: 'var(--z-navbar)', height: '64px',
//         display: 'flex', alignItems: 'center', padding: '0 24px',
//         background: scrolled ? 'rgba(18, 20, 23, 0.53)' : 'rgba(19, 20, 24, 0.23)',
//         backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
//         borderBottom: `1px solid ${scrolled ? 'rgba(255,255,255,0.08)' : 'transparent'}`,
//         transition: 'all 0.3s var(--ease-out)',
//       }}>

//         {/* Logo */}
//         <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', marginRight: 'auto' }}>
//           <img src="/logo.svg" alt="FixTown" style={{ width: '36px', height: '36px', flexShrink: 0 }} />
//           <span className="brand-text" style={{ fontSize: '1.2rem', fontWeight: '800', letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>
//             Fix<span style={{ color: 'var(--amber-500)' }}>Town</span>
//           </span>
//         </Link>

//         {/* Desktop Nav pills */}
//         <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }} className="desktop-nav">
//           {navLinks.map(link => <NavPill key={link.to} {...link} />)}
//           {!user && <NavPill to="/login" label="Sign In" icon={<SignInIcon />} />}
//         </div>

//         {/* Right side */}
//         <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '16px' }}>
//           {user ? (
//             <div style={{ position: 'relative' }}>
//               {/* User avatar button */}
//               <button
//                 onClick={() => setUserMenuOpen(v => !v)}
//                 style={{
//                   display: 'flex', alignItems: 'center', gap: '8px',
//                   padding: '6px 12px 6px 6px',
//                   borderRadius: 'var(--radius-full)',
//                   background: 'rgba(255,255,255,0.05)',
//                   border: '1px solid rgba(255,255,255,0.1)',
//                   cursor: 'pointer', color: 'var(--text-primary)',
//                   fontSize: '0.875rem', fontWeight: '500',
//                   transition: 'all 0.15s ease',
//                 }}
//               >
//                 {/* Avatar circle */}
//                 <div style={{
//                   width: '26px', height: '26px', borderRadius: '50%',
//                   background: 'var(--amber-500)',
//                   display: 'flex', alignItems: 'center', justifyContent: 'center',
//                   fontSize: '0.75rem', fontWeight: '700', color: '#0a0a0a',
//                   flexShrink: 0,
//                 }}>
//                   {user.name?.charAt(0).toUpperCase()}
//                 </div>
//                 <span style={{ maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
//                   {user.name?.split(' ')[0]}
//                 </span>
//                 <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
//                   <polyline points="6 9 12 15 18 9"/>
//                 </svg>
//               </button>

//               {/* Dropdown */}
//               {userMenuOpen && (
//                 <div style={{
//                   position: 'absolute', top: 'calc(100% + 8px)', right: 0,
//                   background: 'var(--bg-surface)',
//                   border: '1px solid var(--border-default)',
//                   borderRadius: 'var(--radius-lg)',
//                   padding: '8px',
//                   minWidth: '180px',
//                   boxShadow: 'var(--shadow-lg)',
//                   zIndex: 10,
//                   animation: 'fadeInUp 0.2s var(--ease-out) both',
//                 }}>
//                   {/* User info */}
//                   <div style={{ padding: '8px 10px 12px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '6px' }}>
//                     <div style={{ fontSize: '0.875rem', fontWeight: '600' }}>{user.name}</div>
//                     <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>{user.email}</div>
//                     <span className={`badge badge-${user.role === 'officer' ? 'in_progress' : 'open'}`} style={{ marginTop: '6px' }}>
//                       {user.role}
//                     </span>
//                   </div>

//                   <Link to={user.role === 'officer' ? '/municipal' : '/dashboard'}
//                     style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', borderRadius: 'var(--radius-md)', color: 'var(--text-secondary)', fontSize: '0.875rem', textDecoration: 'none', transition: 'all 0.1s' }}
//                     onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-elevated)'; e.currentTarget.style.color = 'var(--text-primary)' }}
//                     onMouseLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.style.color = '' }}
//                   >
//                     <DashIcon /> Dashboard
//                   </Link>

//                   <button
//                     onClick={handleLogout}
//                     style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', borderRadius: 'var(--radius-md)', color: 'var(--rose-400)', fontSize: '0.875rem', background: 'transparent', border: 'none', cursor: 'pointer', width: '100%', transition: 'all 0.1s' }}
//                     onMouseEnter={e => { e.currentTarget.style.background = 'rgba(244,63,94,0.08)' }}
//                     onMouseLeave={e => { e.currentTarget.style.background = '' }}
//                   >
//                     <LogoutIcon /> Sign out
//                   </button>
//                 </div>
//               )}
//             </div>
//           ) : (
//             <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
//           )}

//           {/* Mobile menu toggle */}
//           <button
//             onClick={() => setMenuOpen(v => !v)}
//             style={{ display: 'none', background: 'transparent', border: 'none', color: 'var(--text-primary)', padding: '6px', cursor: 'pointer' }}
//             className="mobile-menu-btn"
//             aria-label="Toggle menu"
//           >
//             {menuOpen ? <CloseIcon /> : <MenuIcon />}
//           </button>
//         </div>
//       </nav>

//       {/* Mobile Menu Drawer */}
//       {menuOpen && (
//         <div style={{
//           position: 'fixed', top: '64px', left: 0, right: 0,
//           zIndex: 'calc(var(--z-navbar) - 1)',
//           background: 'rgba(10,10,10,0.98)', backdropFilter: 'blur(16px)',
//           borderBottom: '1px solid var(--border-subtle)',
//           padding: '16px 24px 24px',
//           display: 'flex', flexDirection: 'column', gap: '8px',
//           animation: 'fadeInUp 0.25s var(--ease-out) both',
//         }}>
//           {navLinks.map(link => (
//             <Link key={link.to} to={link.to} style={{
//               display: 'flex', alignItems: 'center', gap: '10px',
//               padding: '12px 16px', borderRadius: 'var(--radius-md)',
//               color: isActive(link.to) ? 'var(--amber-400)' : 'var(--text-secondary)',
//               background: isActive(link.to) ? 'rgba(251,191,36,0.1)' : 'transparent',
//               fontWeight: '500', fontSize: '0.9rem', textDecoration: 'none',
//             }}>
//               {link.icon} {link.label}
//             </Link>
//           ))}
//           <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '8px 0' }} />
//           {user ? (
//             <>
//               <Link to={user.role === 'officer' ? '/municipal' : '/dashboard'}
//                 className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
//                 Dashboard
//               </Link>
//               <button onClick={handleLogout}
//                 className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center', color: 'var(--rose-400)' }}>
//                 Sign out
//               </button>
//             </>
//           ) : (
//             <>
//               <Link to="/login"    className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>Sign in</Link>
//               <Link to="/register" className="btn btn-primary"   style={{ width: '100%', justifyContent: 'center' }}>Get Started</Link>
//             </>
//           )}
//         </div>
//       )}

//       <style>{`
//         @media (max-width: 640px) {
//           .desktop-nav { display: none !important; }
//           .mobile-menu-btn { display: flex !important; }
//           .brand-text { display: none !important; }
//         }
//       `}</style>
//     </>
//   )
// }

import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import NotificationPanel from '../notifications/NotificationPanel'
import { useDelayedUnmount } from '../../hooks/useDelayedUnmount'
 
const MapIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>
    <line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/>
  </svg>
)
 
const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
)
 
const SignInIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
    <polyline points="10 17 15 12 10 7"/>
    <line x1="15" y1="12" x2="3" y2="12"/>
  </svg>
)
 
const DashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
  </svg>
)
 
const LogoutIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
)
 
const MenuIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="3" y1="6" x2="21" y2="6"/>
    <line x1="3" y1="12" x2="21" y2="12"/>
    <line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
)
 
const CloseIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)
 
export default function Navbar() {
  const [scrolled,     setScrolled]     = useState(false)
  const [menuOpen,     setMenuOpen]     = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
 
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
 
  useEffect(() => { setMenuOpen(false); setUserMenuOpen(false) }, [location])
 
  const navLinks = [
    { to: '/map',    label: 'Explore Map',  icon: <MapIcon /> },
    { to: '/report', label: 'Report Issue', icon: <PlusIcon /> },
  ]
 
  const isActive = (path) => location.pathname === path
  const handleLogout = () => { logout(); navigate('/') }
  const shouldRenderUserMenu = useDelayedUnmount(userMenuOpen)
  const shouldRenderMenu = useDelayedUnmount(menuOpen, 200)
 
  const NavPill = ({ to, label, icon }) => (
    <Link to={to} className="nav-pill" style={{
      display: 'flex', alignItems: 'center', gap: '0px',
      padding: '8px', borderRadius: 'var(--radius-full)',
      fontSize: '0.875rem', fontWeight: '500',
      color: isActive(to) ? 'var(--amber-400)' : 'var(--text-secondary)',
      background: isActive(to) ? 'rgba(251,191,36,0.1)' : 'rgba(255,255,255,0.05)',
      border: `1px solid ${isActive(to) ? 'rgba(251,191,36,0.2)' : 'rgba(255,255,255,0.07)'}`,
      textDecoration: 'none', overflow: 'hidden',
      maxWidth: '32px', height: '32px', minWidth: '32px', justifyContent: 'center',
      transition: 'max-width 0.5s cubic-bezier(0.16,1,0.3,1), background 0.15s, color 0.15s, border-color 0.15s, padding 0.5s cubic-bezier(0.16,1,0.3,1)',
      whiteSpace: 'nowrap',
    }}
    onMouseEnter={e => {
      e.currentTarget.style.maxWidth = '160px'
      e.currentTarget.style.minWidth = '32px'
      e.currentTarget.style.padding = '8px 14px'
      e.currentTarget.style.gap = '6px'
      e.currentTarget.style.justifyContent = 'flex-start'
      e.currentTarget.querySelector('span:last-child').style.opacity = '1'
      if (!isActive(to)) {
        e.currentTarget.style.color = 'var(--text-primary)'
        e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'
      }
    }}
    onMouseLeave={e => {
      e.currentTarget.style.maxWidth = '32px'
      e.currentTarget.style.minWidth = '32px'
      e.currentTarget.style.padding = '8px'
      e.currentTarget.style.gap = '0px'
      e.currentTarget.style.justifyContent = 'center'
      e.currentTarget.querySelector('span:last-child').style.opacity = '0'
      if (!isActive(to)) {
        e.currentTarget.style.color = 'var(--text-secondary)'
        e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
      }
    }}>
      <span style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>{icon}</span>
      <span style={{ fontSize: '0.875rem', overflow: 'hidden', opacity: 0, transition: 'opacity 0.2s ease 0.15s' }}>{label}</span>
    </Link>
  )
 
  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        zIndex: 'var(--z-navbar)', height: '64px',
        display: 'flex', alignItems: 'center', padding: '0 24px',
        background: scrolled ? 'rgba(18, 20, 23, 0.53)' : 'rgba(19, 20, 24, 0.23)',
        backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
        borderBottom: `1px solid ${scrolled ? 'rgba(255,255,255,0.08)' : 'transparent'}`,
        transition: 'all 0.3s var(--ease-out)',
      }}>
 
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', marginRight: 'auto' }}>
          <img src="/logo.svg" alt="FixTown" style={{ width: '36px', height: '36px', flexShrink: 0 }} />
          <span className="brand-text" style={{ fontSize: '1.2rem', fontWeight: '800', letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>
            Fix<span style={{ color: 'var(--amber-500)' }}>Town</span>
          </span>
        </Link>
 
        {/* Desktop Nav pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }} className="desktop-nav">
          {navLinks.map(link => <NavPill key={link.to} {...link} />)}
          {!user && <NavPill to="/login" label="Sign In" icon={<SignInIcon />} />}
        </div>
 
        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '16px' }}>
          {user ? (
            <>
              {/* Notification bell */}
              <NotificationPanel />
 
              {/* User avatar dropdown */}
              <div style={{ position: 'relative' }}>
                <button onClick={() => setUserMenuOpen(v => !v)} style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '6px 12px 6px 6px',
                  borderRadius: 'var(--radius-full)',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  cursor: 'pointer', color: 'var(--text-primary)',
                  fontSize: '0.875rem', fontWeight: '500',
                  transition: 'all 0.15s ease',
                }}>
                  <div style={{
                    width: '26px', height: '26px', borderRadius: '50%',
                    background: 'var(--amber-500)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.75rem', fontWeight: '700', color: '#0a0a0a', flexShrink: 0,
                  }}>
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span style={{ maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user.name?.split(' ')[0]}
                  </span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </button>
 
                {shouldRenderUserMenu && (
                  <div style={{
                    position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                    background: 'var(--bg-surface)', border: '1px solid var(--border-default)',
                    borderRadius: 'var(--radius-lg)', padding: '8px',
                    minWidth: '180px', boxShadow: 'var(--shadow-lg)',
                    zIndex: 10,
                    animation: userMenuOpen ? 'fadeInUp 0.2s var(--ease-out) both' : 'fadeOutDown 0.15s ease-in both',
                  }}>
                    <div style={{ padding: '8px 10px 12px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '6px' }}>
                      <div style={{ fontSize: '0.875rem', fontWeight: '600' }}>{user.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>{user.email}</div>
                      <span className={`badge badge-${user.role === 'officer' ? 'in_progress' : 'open'}`} style={{ marginTop: '6px' }}>
                        {user.role}
                      </span>
                    </div>
                    <Link to={user.role === 'officer' ? '/municipal' : '/dashboard'}
                      style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', borderRadius: 'var(--radius-md)', color: 'var(--text-secondary)', fontSize: '0.875rem', textDecoration: 'none', transition: 'all 0.1s' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-elevated)'; e.currentTarget.style.color = 'var(--text-primary)' }}
                      onMouseLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.style.color = '' }}>
                      <DashIcon /> Dashboard
                    </Link>
                    <button onClick={handleLogout}
                      style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', borderRadius: 'var(--radius-md)', color: 'var(--rose-400)', fontSize: '0.875rem', background: 'transparent', border: 'none', cursor: 'pointer', width: '100%', transition: 'all 0.1s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(244,63,94,0.08)'}
                      onMouseLeave={e => e.currentTarget.style.background = ''}>
                      <LogoutIcon /> Sign out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
          )}
 
          <button onClick={() => setMenuOpen(v => !v)}
            style={{ display: 'none', background: 'transparent', border: 'none', color: 'var(--text-primary)', padding: '6px', cursor: 'pointer' }}
            className="mobile-menu-btn" aria-label="Toggle menu">
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </nav>
 
      {/* Mobile Menu Drawer */}
      {menuOpen && (
        <div style={{
          position: 'fixed', top: '64px', left: 0, right: 0,
          zIndex: 'calc(var(--z-navbar) - 1)',
          background: 'rgba(10,10,10,0.98)', backdropFilter: 'blur(16px)',
          borderBottom: '1px solid var(--border-subtle)',
          padding: '16px 24px 24px',
          display: 'flex', flexDirection: 'column', gap: '8px',
           animation: menuOpen ? 'fadeInUp 0.25s var(--ease-out) both' : 'fadeOutDown 0.2s ease-in both',
        }}>
          {navLinks.map(link => (
            <Link key={link.to} to={link.to} style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '12px 16px', borderRadius: 'var(--radius-md)',
              color: isActive(link.to) ? 'var(--amber-400)' : 'var(--text-secondary)',
              background: isActive(link.to) ? 'rgba(251,191,36,0.1)' : 'transparent',
              fontWeight: '500', fontSize: '0.9rem', textDecoration: 'none',
            }}>
              {link.icon} {link.label}
            </Link>
          ))}
          <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '8px 0' }} />
          {user ? (
            <>
              <Link to={user.role === 'officer' ? '/municipal' : '/dashboard'}
                className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
                Dashboard
              </Link>
              <button onClick={handleLogout}
                className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center', color: 'var(--rose-400)' }}>
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/login"    className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>Sign in</Link>
              <Link to="/register" className="btn btn-primary"   style={{ width: '100%', justifyContent: 'center' }}>Get Started</Link>
            </>
          )}
        </div>
      )}
 
      <style>{`
        @media (max-width: 640px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
          .brand-text { display: none !important; }
        }
      `}</style>
    </>
  )
}