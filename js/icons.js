(function () {
  'use strict';

  /* ─────────────────────────────────────────────────────────
     SVG ICON DEFINITIONS
     ใช้ currentColor เพื่อ inherit สีจาก CSS
  ───────────────────────────────────────────────────────── */
  const SVG = {

    // ── Value Cards ─────────────────────────────────────────
    trophy: `<svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 30C15.477 30 11 25.523 11 20V10H31V20C31 25.523 26.523 30 21 30Z" fill="currentColor" opacity="0.13" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
      <path d="M11 15H7C7 15 7 22 11 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M31 15H35C35 15 35 22 31 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M17 30V33H25V30" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M14 33H28" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <path d="M21 15L22.8 19.5H27L23.8 22.1L25 26.5L21 24L17 26.5L18.2 22.1L15 19.5H19.2L21 15Z" fill="currentColor"/>
    </svg>`,

    handshake: `<svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 20L14 13H19L24 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M35 20L28 13H23L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M7 20L15 28L20 32L25 27L30 32L35 26" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="21" cy="22" r="4" fill="currentColor" opacity="0.15" stroke="currentColor" stroke-width="1.5"/>
      <path d="M18.5 22H23.5M21 19.5V24.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    </svg>`,

    lightbulb: `<svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 9C15.477 9 11 13.477 11 19C11 22.5 12.8 25.6 15.5 27.5V31H26.5V27.5C29.2 25.6 31 22.5 31 19C31 13.477 26.523 9 21 9Z" fill="currentColor" opacity="0.1" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
      <path d="M17 33H25M18 36H24" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <path d="M21 9V7M9 19H7M33 19H35M12.2 11.2L10.8 9.8M29.8 11.2L31.2 9.8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
      <path d="M17 19L19.5 21.5L25 16" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,

    // ── How-to Steps ────────────────────────────────────────
    home: `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 15L16 4L29 15V29H21V22H11V29H3V15Z" fill="currentColor" opacity="0.1" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
      <path d="M11 29V22H21V29" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="16" cy="16.5" r="2.5" fill="currentColor" opacity="0.45"/>
    </svg>`,

    search: `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="14" cy="14" r="9" fill="currentColor" opacity="0.08" stroke="currentColor" stroke-width="2"/>
      <path d="M21 21L29 29" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M10 14H18M14 10V18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
    </svg>`,

    clipboard: `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="7" width="20" height="23" rx="3" fill="currentColor" opacity="0.08" stroke="currentColor" stroke-width="2"/>
      <path d="M13 7V5.5C13 4.672 13.672 4 14.5 4H17.5C18.328 4 19 4.672 19 5.5V7" stroke="currentColor" stroke-width="2"/>
      <rect x="11" y="7" width="10" height="4" rx="1" fill="currentColor" opacity="0.25"/>
      <path d="M10 16H22M10 20H18M10 24H15" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
    </svg>`,

    target: `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="12" fill="currentColor" opacity="0.07" stroke="currentColor" stroke-width="2"/>
      <circle cx="16" cy="16" r="7" fill="currentColor" opacity="0.1" stroke="currentColor" stroke-width="1.5"/>
      <circle cx="16" cy="16" r="3" fill="currentColor"/>
      <path d="M16 4V8M16 24V28M4 16H8M24 16H28" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
    </svg>`,

    // ── Showcase Checklist (small, white on gradient bg) ────
    money_sm: `<svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="8.5" cy="8.5" r="6.5" stroke="white" stroke-width="1.6"/>
      <path d="M8.5 4.5V5.5M8.5 11.5V12.5" stroke="white" stroke-width="1.6" stroke-linecap="round"/>
      <path d="M6 7C6 5.895 7.119 5 8.5 5C9.881 5 11 5.895 11 7C11 8.105 9.881 9 8.5 9C7.119 9 6 9.895 6 11C6 12.105 7.119 13 8.5 13C9.881 13 11 12.105 11 11" stroke="white" stroke-width="1.6" stroke-linecap="round"/>
    </svg>`,

    grad_sm: `<svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8.5 3L1 6.5L8.5 10L16 6.5L8.5 3Z" fill="white" opacity="0.9"/>
      <path d="M4.5 8V11.5C4.5 11.5 6 13.5 8.5 13.5C11 13.5 12.5 11.5 12.5 11.5V8" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M16 6.5V10" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
    </svg>`,

    chart_sm: `<svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 14.5H15" stroke="white" stroke-width="1.6" stroke-linecap="round"/>
      <rect x="3" y="10" width="2.8" height="4.5" rx="0.5" fill="white" opacity="0.75"/>
      <rect x="7.1" y="7" width="2.8" height="7.5" rx="0.5" fill="white"/>
      <rect x="11.2" y="4" width="2.8" height="10.5" rx="0.5" fill="white" opacity="0.85"/>
      <path d="M4.4 9.5L8.5 6.5L11.5 8.5L15 4" stroke="white" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,

    search_sm: `<svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="7.5" cy="7.5" r="5" stroke="white" stroke-width="1.6"/>
      <path d="M11.5 11.5L15 15" stroke="white" stroke-width="1.8" stroke-linecap="round"/>
      <path d="M5.5 7.5H9.5M7.5 5.5V9.5" stroke="white" stroke-width="1.3" stroke-linecap="round"/>
    </svg>`,

    // ── Feature Tab Card icons (white on gradient) ──────────
    salary_lg: `<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="14" cy="14" r="10" stroke="white" stroke-width="2"/>
      <path d="M14 7V8.5M14 19.5V21" stroke="white" stroke-width="2" stroke-linecap="round"/>
      <path d="M10 11C10 9.343 11.791 8 14 8C16.209 8 18 9.343 18 11C18 12.657 16.209 14 14 14C11.791 14 10 15.343 10 17C10 18.657 11.791 20 14 20C16.209 20 18 18.657 18 17" stroke="white" stroke-width="2" stroke-linecap="round"/>
    </svg>`,

    grad_lg: `<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 5L2 11L14 17L26 11L14 5Z" fill="white" opacity="0.9"/>
      <path d="M6.5 14V20C6.5 20 9.5 24 14 24C18.5 24 21.5 20 21.5 20V14" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M26 11V16.5" stroke="white" stroke-width="2" stroke-linecap="round"/>
      <circle cx="26" cy="18" r="1.8" fill="white"/>
    </svg>`,

    chart_lg: `<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3.5 24H24.5" stroke="white" stroke-width="2" stroke-linecap="round"/>
      <rect x="4.5" y="17" width="5" height="7" rx="1.2" fill="white" opacity="0.75"/>
      <rect x="11.5" y="12" width="5" height="12" rx="1.2" fill="white"/>
      <rect x="18.5" y="7" width="5" height="17" rx="1.2" fill="white" opacity="0.85"/>
      <path d="M7 16L14 11L20 13.5L25 8" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="25" cy="8" r="2.5" fill="white"/>
    </svg>`,

    brain_lg: `<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 5C9.5 5 6 8.5 6 12.5C6 15 7.2 17.2 9 18.5V21.5H19V18.5C20.8 17.2 22 15 22 12.5C22 8.5 18.5 5 14 5Z" stroke="white" stroke-width="2" fill="white" fill-opacity="0.15"/>
      <path d="M10.5 21.5V23.5M17.5 21.5V23.5" stroke="white" stroke-width="1.6" stroke-linecap="round"/>
      <path d="M10.5 24.5H17.5" stroke="white" stroke-width="2" stroke-linecap="round"/>
      <path d="M11 11.5C11 11.5 12 9 14 9.5C16 10 17 12.5 14.5 14C13.5 14.8 13.5 16.5 13.5 16.5" stroke="white" stroke-width="1.6" stroke-linecap="round"/>
      <circle cx="13.5" cy="18" r="1.2" fill="white"/>
    </svg>`,

    // ── Roadmap Cards (อัปเกรดเป็นไอคอน Modern Duotone) ──────
    database: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 12C21 13.6569 16.9706 15 12 15C7.02944 15 3 13.6569 3 12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
      <path d="M21 19C21 20.6569 16.9706 22 12 22C7.02944 22 3 20.6569 3 19" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
      <path d="M21 5C21 6.65685 16.9706 8 12 8C7.02944 8 3 6.65685 3 5C3 3.34315 7.02944 2 12 2C16.9706 2 21 3.34315 21 5Z" fill="currentColor" fill-opacity="0.15" stroke="currentColor" stroke-width="1.8"/>
    </svg>`,

    brain_sm: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 4.5C12 4.5 10 2.5 7 2.5C4 2.5 2 5 2 8C2 10.5 4.5 12 6 12.5V17C6 19.5 8 21.5 10.5 21.5H13.5C16 21.5 18 19.5 18 17V12.5C19.5 12 22 10.5 22 8C22 5 20 2.5 17 2.5C14 2.5 12 4.5 12 4.5Z" fill="currentColor" fill-opacity="0.15" stroke="currentColor" stroke-width="1.8"/>
      <path d="M12 4.5V21.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-dasharray="3 3"/>
      <path d="M6 10C6 10 7.5 8.5 9.5 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      <circle cx="9.5" cy="14.5" r="1.5" fill="currentColor"/>
    </svg>`,

    mobile_sm: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="2" width="14" height="20" rx="3" fill="currentColor" fill-opacity="0.15" stroke="currentColor" stroke-width="1.8"/>
      <path d="M10 5H14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
      <rect x="9" y="9" width="6" height="6" rx="1.5" fill="currentColor" fill-opacity="0.3"/>
      <circle cx="12" cy="18" r="1.5" fill="currentColor"/>
    </svg>`,

    bell_sm: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 3V4C9 4 7 6.5 7 9.5V15L5 17H19L17 15V9.5C17 6.5 15 4 12 4V3Z" fill="currentColor" fill-opacity="0.15" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
      <path d="M10 17C10 18.1046 10.8954 19 12 19C13.1046 19 14 18.1046 14 17" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
      <circle cx="18" cy="6" r="3" fill="#ef4444" stroke="#ffffff" stroke-width="1.5"/>
    </svg>`,

    users_sm: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 21V19C16 16.7909 14.2091 15 12 15H5C2.79086 15 1 16.7909 1 19V21" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
      <circle cx="8.5" cy="7" r="4" fill="currentColor" fill-opacity="0.15" stroke="currentColor" stroke-width="1.8"/>
      <path d="M23 21V19C23 17.1325 21.7221 15.563 19.9826 15.1354" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
      <path d="M16 3.13544C17.7395 3.563 19 5.13253 19 7.00004C19 8.86754 17.7395 10.4371 16 10.8646" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
    </svg>`,

    robot_sm: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="8" width="16" height="12" rx="3" fill="currentColor" fill-opacity="0.15" stroke="currentColor" stroke-width="1.8"/>
      <path d="M12 8V4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
      <circle cx="12" cy="3" r="1.5" fill="currentColor"/>
      <circle cx="9" cy="13" r="2" fill="currentColor"/>
      <circle cx="15" cy="13" r="2" fill="currentColor"/>
      <path d="M10 17H14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
      <path d="M4 12H2M22 12H20" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
    </svg>`,

    // ── Branch Cards ─────────────────────────────────────────
    building: `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="4" width="22" height="25" rx="2.5" fill="currentColor" fill-opacity="0.1" stroke="currentColor" stroke-width="1.6"/>
      <path d="M5 11H27" stroke="currentColor" stroke-width="1" opacity="0.4"/>
      <rect x="8.5" y="7.5" width="3.5" height="3.5" rx="0.6" fill="currentColor" opacity="0.5"/>
      <rect x="14.25" y="7.5" width="3.5" height="3.5" rx="0.6" fill="currentColor" opacity="0.5"/>
      <rect x="20" y="7.5" width="3.5" height="3.5" rx="0.6" fill="currentColor" opacity="0.5"/>
      <rect x="8.5" y="14" width="3.5" height="3.5" rx="0.6" fill="currentColor" opacity="0.5"/>
      <rect x="14.25" y="14" width="3.5" height="3.5" rx="0.6" fill="currentColor" opacity="0.5"/>
      <rect x="20" y="14" width="3.5" height="3.5" rx="0.6" fill="currentColor" opacity="0.5"/>
      <rect x="8.5" y="20.5" width="3.5" height="3.5" rx="0.6" fill="currentColor" opacity="0.5"/>
      <rect x="20" y="20.5" width="3.5" height="3.5" rx="0.6" fill="currentColor" opacity="0.5"/>
      <rect x="13.5" y="22" width="5" height="7" rx="0.6" fill="currentColor" opacity="0.7"/>
    </svg>`,

    package: `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 4L29 10.5V21.5L16 28L3 21.5V10.5L16 4Z" fill="currentColor" fill-opacity="0.09" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
      <path d="M3 10.5L16 17L29 10.5M16 4V28" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
      <path d="M9.5 7L22.5 13.5" stroke="currentColor" stroke-width="1" stroke-linecap="round" opacity="0.4"/>
    </svg>`,

    cart: `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3.5 5H8L12 22H24L28 12H12" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="14" cy="26" r="2.3" fill="currentColor"/>
      <circle cx="22" cy="26" r="2.3" fill="currentColor"/>
      <path d="M15.5 16H20.5M18 13.5V18.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" opacity="0.55"/>
    </svg>`,

    smartphone: `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="3" width="16" height="26" rx="3.5" fill="currentColor" fill-opacity="0.1" stroke="currentColor" stroke-width="1.6"/>
      <path d="M13 7H19" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
      <circle cx="16" cy="25.5" r="1.8" fill="currentColor"/>
      <rect x="11" y="11" width="10" height="10" rx="2" fill="currentColor" fill-opacity="0.14" stroke="currentColor" stroke-width="1"/>
      <path d="M13.5 16L15.2 17.8L18.5 14" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,

    // ── Footer column icons ──────────────────────────────────
    pin: `<svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8.5 1C5.467 1 3 3.467 3 6.5C3 10.5 8.5 16 8.5 16C8.5 16 14 10.5 14 6.5C14 3.467 11.533 1 8.5 1Z" stroke="white" stroke-width="1.5" fill="white" fill-opacity="0.18"/>
      <circle cx="8.5" cy="6.5" r="2.2" stroke="white" stroke-width="1.4"/>
    </svg>`,

    download: `<svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2.5" y="2" width="8" height="10" rx="1.5" stroke="white" stroke-width="1.4"/>
      <path d="M6.5 5V8.5M6.5 8.5L5 7M6.5 8.5L8 7" stroke="white" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M2.5 14H14.5" stroke="white" stroke-width="1.4" stroke-linecap="round" opacity="0.6"/>
      <path d="M13 5.5V10M11 8L13 10.5L15 8" stroke="white" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" opacity="0.85"/>
    </svg>`,

    // ── Mockup job list ──────────────────────────────────────
    laptop: `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="3.5" width="14" height="9" rx="1.5" stroke="#3b82f6" stroke-width="1.4" fill="rgba(59,130,246,0.12)"/>
      <path d="M6.5 8L8 9.5L11.5 6" stroke="#3b82f6" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M1 13H17M6 13L5 14.5H13L12 13" stroke="#3b82f6" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,

    medplus: `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="14" height="14" rx="3.5" fill="rgba(16,185,129,0.12)" stroke="#10b981" stroke-width="1.4"/>
      <path d="M9 5.5V12.5M5.5 9H12.5" stroke="#10b981" stroke-width="1.8" stroke-linecap="round"/>
    </svg>`,

    palette: `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="9" cy="9" r="7" stroke="#f59e0b" stroke-width="1.4" fill="rgba(245,158,11,0.1)"/>
      <circle cx="6.5" cy="7" r="1.3" fill="#f59e0b"/>
      <circle cx="11.5" cy="7" r="1.3" fill="#f59e0b"/>
      <circle cx="9" cy="11.5" r="1.3" fill="#f59e0b"/>
      <path d="M11 14.5C11 14.5 13.5 14 13.5 11.5C13.5 10.119 12.381 9.5 11.5 9.5C10.672 9.5 10 10.172 10 11" stroke="#f59e0b" stroke-width="1.2" stroke-linecap="round"/>
    </svg>`,
  };

  /* ─────────────────────────────────────────────────────────
     APPLY ICONS TO DOM
  ───────────────────────────────────────────────────────── */
  function applyIcons() {

    /* 1 ── Value cards (vc-1/2/3 .value-icon-wrap) */
    const vcData = [
      { sel: '.vc-1 .value-icon-wrap', svg: SVG.trophy,    color: '#be185d' },
      { sel: '.vc-2 .value-icon-wrap', svg: SVG.handshake, color: '#7c3aed' },
      { sel: '.vc-3 .value-icon-wrap', svg: SVG.lightbulb, color: '#0891b2' },
    ];
    vcData.forEach(({ sel, svg, color }) => {
      const el = document.querySelector(sel);
      if (el) el.innerHTML = `<span style="color:${color};display:flex;align-items:center;justify-content:center;">${svg}</span>`;
    });

    /* 2 ── How-to steps (.how-step-icon) */
    const howIcons = [SVG.home, SVG.search, SVG.clipboard, SVG.target];
    document.querySelectorAll('.how-step-icon').forEach((el, i) => {
      if (howIcons[i]) {
        el.innerHTML = `<span style="color:#be185d;display:flex;align-items:center;justify-content:center;">${howIcons[i]}</span>`;
      }
    });

    /* 3 ── Showcase checklist (.sc-icon) */
    const scIcons = [SVG.money_sm, SVG.grad_sm, SVG.chart_sm, SVG.search_sm];
    document.querySelectorAll('.sc-icon').forEach((el, i) => {
      if (scIcons[i]) {
        el.innerHTML = scIcons[i];
        el.style.fontSize = '0'; 
      }
    });

    /* 4 ── Feature tab cards (.ftc-icon-wrap) */
    const ftcIcons = [SVG.salary_lg, SVG.grad_lg, SVG.chart_lg, SVG.brain_lg];
    document.querySelectorAll('.ftc-icon-wrap').forEach((el, i) => {
      if (ftcIcons[i]) {
        el.innerHTML = ftcIcons[i];
        el.style.fontSize = '0';
      }
    });

    /* 5 ── Roadmap cards (.rc-title) */
    const roadmapMap = {
      '🗄️': { svg: SVG.database,  green: true },
      '🧠': { svg: SVG.brain_sm,  green: true },
      '📱': { svg: SVG.mobile_sm, green: true },
      '🔔': { svg: SVG.bell_sm,   green: false, color: '#92400e' },
      '🤝': { svg: SVG.users_sm,  green: false, color: '#92400e' },
      '🤖': { svg: SVG.robot_sm,  green: true },
    };
    document.querySelectorAll('.rc-title').forEach(el => {
      let html = el.innerHTML;
      let changed = false;
      for (const [emoji, { svg, green, color }] of Object.entries(roadmapMap)) {
        if (html.includes(emoji)) {
          const isDone     = !!el.closest('.rc-done');
          const isProgress = !!el.closest('.rc-progress');
          const c = isDone ? '#166534' : isProgress ? '#92400e' : '#be185d';
          // ปรับโครงสร้างระยะห่างเล็กน้อยเพื่อให้เข้ากับไอคอนขนาดใหญ่ขึ้น (24x24)
          const iconHtml = `<span style="color:${color||c};display:inline-flex;align-items:center;vertical-align:middle;margin-right:6px;position:relative;top:-1px;">${svg}</span>`;
          html = html.replace(emoji, iconHtml);
          changed = true;
        }
      }
      if (changed) el.innerHTML = html;
    });

    /* 6 ── Branch cards (.branch-icon) */
    const branchIcons = [SVG.building, SVG.package, SVG.cart, SVG.smartphone];
    document.querySelectorAll('.branch-icon').forEach((el, i) => {
      if (branchIcons[i]) {
        el.innerHTML = `<span style="color:#be185d;display:flex;align-items:center;justify-content:center;margin-bottom:4px;">${branchIcons[i]}</span>`;
        el.style.fontSize = '0';
      }
    });

    /* 7 ── Footer column icons (.ft-col-title-icon) */
    const footerIcons = [SVG.pin, SVG.download];
    document.querySelectorAll('.ft-col-title-icon').forEach((el, i) => {
      if (footerIcons[i]) {
        el.innerHTML = footerIcons[i];
        el.style.fontSize = '0';
      }
    });

    /* 8 ── Mockup job list icons (.mjl-icon) */
    const mockupIcons = [SVG.laptop, SVG.medplus, SVG.palette];
    document.querySelectorAll('.mjl-icon').forEach((el, i) => {
      if (mockupIcons[i]) {
        el.innerHTML = mockupIcons[i];
        el.style.fontSize = '0';
      }
    });
  }

  /* ─────────────────────────────────────────────────────────
     INJECT ICON STYLES
  ───────────────────────────────────────────────────────── */
  function injectStyles() {
    if (document.getElementById('cep-icon-styles')) return;
    const style = document.createElement('style');
    style.id = 'cep-icon-styles';
    style.textContent = `
      /* Icon container resets */
      .value-icon-wrap span,
      .how-step-icon span,
      .branch-icon span {
        display: flex;
        align-items: center;
        justify-content: center;
        line-height: 1;
      }

      /* Smooth hover transforms */
      .value-card:hover .value-icon-wrap span svg,
      .branch-card:hover .branch-icon span svg {
        transform: scale(1.12) rotate(6deg);
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
      .value-icon-wrap span svg,
      .branch-icon span svg {
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }

      /* How step hover */
      .how-step:hover .how-step-icon span svg {
        transform: scale(1.15);
        transition: transform 0.25s ease;
      }
      .how-step-icon span svg {
        transition: transform 0.25s ease;
      }

      /* Feature tab icon wrap hover */
      .feature-tab-card:hover .ftc-icon-wrap svg {
        transform: scale(1.1) rotate(5deg);
        transition: transform 0.3s ease;
      }
      .ftc-icon-wrap svg {
        transition: transform 0.3s ease;
      }
    `;
    document.head.appendChild(style);
  }

  /* ─────────────────────────────────────────────────────────
     INIT
  ───────────────────────────────────────────────────────── */
  function init() {
    injectStyles();
    applyIcons();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Re-run after SPA page transitions (router calls showPage)
  // Patch window.showPage if it exists or will exist
  function patchRouter() {
    if (typeof window.showPage === 'function' && !window._iconsPatchApplied) {
      const orig = window.showPage;
      window.showPage = function (...args) {
        const result = orig.apply(this, args);
        setTimeout(applyIcons, 80);
        return result;
      };
      window._iconsPatchApplied = true;
    }
  }

  // Try patching immediately, and again after scripts load
  patchRouter();
  window.addEventListener('load', patchRouter);

  // Expose for manual call if needed
  window.CEP_applyIcons = applyIcons;

})();