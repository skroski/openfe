/* @ds-bundle: {"format":4,"namespace":"CodemixDesignSystem_95bbea","components":[{"name":"BulletList","sourcePath":"components/content/BulletList.jsx"},{"name":"MediaLinkList","sourcePath":"components/content/MediaLinkList.jsx"},{"name":"ProductThumb","sourcePath":"components/content/ProductThumb.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"LinkArrow","sourcePath":"components/core/LinkArrow.jsx"},{"name":"Logo","sourcePath":"components/core/Logo.jsx"},{"name":"SectionHeading","sourcePath":"components/core/SectionHeading.jsx"},{"name":"Avatar","sourcePath":"components/data/Avatar.jsx"},{"name":"Card","sourcePath":"components/data/Card.jsx"},{"name":"Divider","sourcePath":"components/data/Divider.jsx"},{"name":"Kbd","sourcePath":"components/data/Kbd.jsx"},{"name":"Stats","sourcePath":"components/data/Stats.jsx"},{"name":"Table","sourcePath":"components/data/Table.jsx"},{"name":"Alert","sourcePath":"components/feedback/Alert.jsx"},{"name":"Loading","sourcePath":"components/feedback/Loading.jsx"},{"name":"Progress","sourcePath":"components/feedback/Progress.jsx"},{"name":"Skeleton","sourcePath":"components/feedback/Skeleton.jsx"},{"name":"Toast","sourcePath":"components/feedback/Toast.jsx"},{"name":"Tooltip","sourcePath":"components/feedback/Tooltip.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Field","sourcePath":"components/forms/Field.jsx"},{"name":"Fieldset","sourcePath":"components/forms/Fieldset.jsx"},{"name":"FileInput","sourcePath":"components/forms/FileInput.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Radio","sourcePath":"components/forms/Radio.jsx"},{"name":"Range","sourcePath":"components/forms/Range.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Textarea","sourcePath":"components/forms/Textarea.jsx"},{"name":"Toggle","sourcePath":"components/forms/Toggle.jsx"},{"name":"HighlightBar","sourcePath":"components/layout/HighlightBar.jsx"},{"name":"NavTabs","sourcePath":"components/layout/NavTabs.jsx"},{"name":"Panel","sourcePath":"components/layout/Panel.jsx"},{"name":"Breadcrumbs","sourcePath":"components/navigation/Breadcrumbs.jsx"},{"name":"Pagination","sourcePath":"components/navigation/Pagination.jsx"},{"name":"Steps","sourcePath":"components/navigation/Steps.jsx"},{"name":"Tabs","sourcePath":"components/navigation/Tabs.jsx"},{"name":"Accordion","sourcePath":"components/overlay/Accordion.jsx"},{"name":"Dropdown","sourcePath":"components/overlay/Dropdown.jsx"},{"name":"Modal","sourcePath":"components/overlay/Modal.jsx"}],"sourceHashes":{"components/content/BulletList.jsx":"5ea641b3d19b","components/content/MediaLinkList.jsx":"7de0c5f3bbe9","components/content/ProductThumb.jsx":"6f35db8d9a37","components/core/Badge.jsx":"543697c03743","components/core/Button.jsx":"c7694cbe9a44","components/core/LinkArrow.jsx":"70c3e422b80c","components/core/Logo.jsx":"2b0dc4087212","components/core/SectionHeading.jsx":"67ff7aec9bdd","components/data/Avatar.jsx":"551b0f213112","components/data/Card.jsx":"5aa513a62ad6","components/data/Divider.jsx":"f5f9548a97d4","components/data/Kbd.jsx":"edb7e457fc24","components/data/Stats.jsx":"93c5709403e0","components/data/Table.jsx":"e5731e25bbef","components/feedback/Alert.jsx":"58e536ae0832","components/feedback/Loading.jsx":"c044a1caeacf","components/feedback/Progress.jsx":"0a0091379c97","components/feedback/Skeleton.jsx":"0f5142fc300d","components/feedback/Toast.jsx":"4cfac845083c","components/feedback/Tooltip.jsx":"fe5a8655bd48","components/forms/Checkbox.jsx":"754dc2bcc85a","components/forms/Field.jsx":"473debc6277d","components/forms/Fieldset.jsx":"d4bae25e966e","components/forms/FileInput.jsx":"76b535c26ff3","components/forms/Input.jsx":"b3e5d13afaeb","components/forms/Radio.jsx":"70a01cf6968d","components/forms/Range.jsx":"cdf2d38e09e1","components/forms/Select.jsx":"1009db319570","components/forms/Textarea.jsx":"5f9bb67bba5f","components/forms/Toggle.jsx":"613ac8a6ff06","components/layout/HighlightBar.jsx":"a51beaf0ff99","components/layout/NavTabs.jsx":"1a4c068c7e14","components/layout/Panel.jsx":"2ec95fccf690","components/navigation/Breadcrumbs.jsx":"91d29bb89a27","components/navigation/Pagination.jsx":"14f119f3f49b","components/navigation/Steps.jsx":"fe700a65c82b","components/navigation/Tabs.jsx":"5363ad5ea478","components/overlay/Accordion.jsx":"8b2c65b578cc","components/overlay/Dropdown.jsx":"67365665a389","components/overlay/Modal.jsx":"603c47424b00","ui_kits/brand-banner/BannerSquare.jsx":"b1dfe739f582","ui_kits/brand-banner/BannerWide.jsx":"ee8a0eb1f823","ui_kits/codemix-web/AsidePitch.jsx":"4753006ec2b1","ui_kits/codemix-web/ContactScreen.jsx":"a25702c7fe04","ui_kits/codemix-web/HeroBand.jsx":"a7a1c20336e9","ui_kits/codemix-web/HomeScreen.jsx":"ccc50312cf18","ui_kits/codemix-web/ProductsScreen.jsx":"7fa83ca27d59","ui_kits/codemix-web/SiteChrome.jsx":"ba8ac7270ad4"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.CodemixDesignSystem_95bbea = window.CodemixDesignSystem_95bbea || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/content/BulletList.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function BulletList({
  items = [],
  tone = "dark",
  style,
  ...rest
}) {
  const dark = tone === "dark";
  return /*#__PURE__*/React.createElement("ul", _extends({
    style: {
      listStyle: "none",
      margin: 0,
      padding: 0,
      display: "grid",
      gap: "var(--space-4)",
      ...style
    }
  }, rest), items.map((t, i) => /*#__PURE__*/React.createElement("li", {
    key: i,
    style: {
      display: "grid",
      gridTemplateColumns: "14px 1fr",
      gap: "var(--space-4)",
      font: "var(--type-body)",
      color: dark ? "var(--text-on-dark-muted)" : "var(--text-body)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      color: "var(--amber-400)",
      fontSize: "16px",
      lineHeight: 1.35,
      textAlign: "center"
    }
  }, "\u2022"), /*#__PURE__*/React.createElement("span", null, t))));
}
Object.assign(__ds_scope, { BulletList });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/BulletList.jsx", error: String((e && e.message) || e) }); }

// components/content/MediaLinkList.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const codemixMediaKindLabel = {
  video: "video",
  flash: "apresentação",
  jpg: "screenshot",
  doc: "documento"
};
function MediaLinkList({
  items = [],
  tone = "light",
  style,
  ...rest
}) {
  const dark = tone === "dark";
  return /*#__PURE__*/React.createElement("ul", _extends({
    style: {
      listStyle: "none",
      margin: 0,
      padding: 0,
      display: "grid",
      ...style
    }
  }, rest), items.map((it, i) => /*#__PURE__*/React.createElement("li", {
    key: i,
    style: {
      borderTop: i ? "1px solid " + (dark ? "var(--border-on-dark)" : "var(--border-subtle)") : "none"
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: it.href || "#",
    style: {
      display: "grid",
      gridTemplateColumns: "26px 1fr",
      alignItems: "center",
      gap: "var(--space-5)",
      padding: "var(--space-5) var(--space-4)",
      textDecoration: "none",
      color: dark ? "var(--text-on-dark)" : "var(--text-body)",
      font: "var(--type-body)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      width: "22px",
      height: "22px",
      borderRadius: "var(--radius-xs)",
      background: dark ? "rgba(255,255,255,.10)" : "var(--neutral-300)",
      color: dark ? "var(--amber-400)" : "var(--graphite-800)",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      font: "var(--fw-medium) 9px/1 var(--font-display)",
      textTransform: "uppercase",
      letterSpacing: ".04em"
    }
  }, it.kind === "video" ? "\u25B6" : it.kind === "jpg" ? "JPG" : it.kind === "flash" ? "SWF" : "DOC"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", {
    style: {
      fontWeight: "var(--fw-medium)"
    }
  }, it.label), " ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--text-muted)"
    }
  }, it.meta || codemixMediaKindLabel[it.kind] || ""))))));
}
Object.assign(__ds_scope, { MediaLinkList });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/MediaLinkList.jsx", error: String((e && e.message) || e) }); }

// components/content/ProductThumb.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ProductThumb({
  src,
  alt = "",
  width = 180,
  height = 100,
  caption,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("figure", _extends({
    style: {
      margin: 0,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      width: width + "px",
      height: height + "px",
      background: "var(--neutral-000)",
      border: "1px solid var(--border-subtle)",
      borderRadius: "var(--radius-sm)",
      boxShadow: "var(--shadow-card)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden"
    }
  }, src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: alt,
    style: {
      maxWidth: "84%",
      maxHeight: "78%",
      objectFit: "contain",
      display: "block"
    }
  }) : /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--fw-regular) var(--fs-caption)/1.3 var(--font-sans)",
      color: "var(--neutral-500)"
    }
  }, "logo do produto")), caption && /*#__PURE__*/React.createElement("figcaption", {
    style: {
      marginTop: "var(--space-4)",
      font: "var(--fw-regular) var(--fs-caption)/1.3 var(--font-sans)",
      color: "var(--text-muted)"
    }
  }, caption));
}
Object.assign(__ds_scope, { ProductThumb });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/ProductThumb.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const codemixBadgeBase = {
  display: "inline-flex",
  alignItems: "center",
  gap: "var(--space-2)",
  height: "20px",
  padding: "0 var(--space-5)",
  borderRadius: "var(--radius-pill)",
  font: "var(--fw-semibold) var(--fs-caption)/1 var(--font-display)",
  letterSpacing: "var(--ls-kicker)",
  textTransform: "uppercase",
  whiteSpace: "nowrap"
};
const codemixBadgeTones = {
  brand: {
    background: "var(--grad-brand)",
    color: "var(--charcoal-900)"
  },
  outline: {
    background: "transparent",
    color: "var(--text-accent)",
    boxShadow: "inset 0 0 0 1px var(--orange-500)"
  },
  neutral: {
    background: "var(--neutral-300)",
    color: "var(--graphite-800)"
  },
  dark: {
    background: "var(--charcoal-900)",
    color: "var(--amber-400)"
  }
};
function Badge({
  children,
  tone = "brand",
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      ...codemixBadgeBase,
      ...(codemixBadgeTones[tone] || codemixBadgeTones.brand),
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const codemixButtonBase = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "0",
  font: "var(--fw-medium) var(--fs-body)/1 var(--font-sans)",
  letterSpacing: "var(--ls-nav)",
  borderRadius: "var(--radius-sm)",
  border: "1px solid",
  cursor: "pointer",
  padding: "0",
  overflow: "hidden",
  transition: "var(--transition-control)",
  userSelect: "none",
  textDecoration: "none",
  boxSizing: "border-box"
};
const codemixButtonSizes = {
  xs: {
    height: "var(--target-min)",
    pad: "0 var(--space-4)",
    fs: "var(--fs-caption)"
  },
  sm: {
    height: "var(--control-h-sm)",
    pad: "0 var(--space-5)",
    fs: "var(--fs-body-sm)"
  },
  md: {
    height: "var(--control-h)",
    pad: "0 var(--space-7)",
    fs: "var(--fs-body)"
  },
  lg: {
    height: "42px",
    pad: "0 var(--space-9)",
    fs: "var(--fs-body-lg)"
  },
  xl: {
    height: "var(--target-comfort)",
    pad: "0 var(--space-10)",
    fs: "var(--fs-body-lg)"
  }
};
const codemixButtonVariants = {
  primary: {
    background: "var(--grad-brand)",
    borderColor: "var(--orange-700)",
    color: "#fff",
    textShadow: "0 1px 1px rgba(0,0,0,.35)",
    boxShadow: "var(--shadow-button)"
  },
  brand: {
    background: "var(--grad-brand)",
    borderColor: "var(--orange-700)",
    color: "var(--text-on-brand)",
    boxShadow: "var(--shadow-button)"
  },
  secondary: {
    background: "linear-gradient(180deg,#fdfdfd 0%,#e9e9e9 100%)",
    borderColor: "var(--border-strong)",
    color: "var(--text-body)",
    boxShadow: "var(--shadow-button)"
  },
  dark: {
    background: "linear-gradient(180deg,var(--slate-600) 0%,var(--graphite-800) 100%)",
    borderColor: "#2b2b2b",
    color: "var(--text-on-dark)",
    boxShadow: "var(--shadow-button)"
  },
  outline: {
    background: "transparent",
    borderColor: "var(--orange-800)",
    color: "var(--orange-800)",
    boxShadow: "none"
  },
  soft: {
    background: "var(--warning-100)",
    borderColor: "transparent",
    color: "var(--orange-800)",
    boxShadow: "none"
  },
  danger: {
    background: "var(--danger-500)",
    borderColor: "var(--danger-700)",
    color: "#fff",
    boxShadow: "var(--shadow-button)"
  },
  ghost: {
    background: "transparent",
    borderColor: "transparent",
    color: "var(--link)",
    boxShadow: "none"
  },
  link: {
    background: "transparent",
    borderColor: "transparent",
    color: "var(--link-aa)",
    boxShadow: "none",
    textDecoration: "underline",
    textUnderlineOffset: "3px"
  }
};
function Button({
  children,
  variant = "primary",
  size = "md",
  arrow = false,
  disabled = false,
  loading = false,
  block = false,
  square = false,
  href,
  icon,
  type,
  onClick,
  style,
  ...rest
}) {
  const s = codemixButtonSizes[size] || codemixButtonSizes.md;
  const v = codemixButtonVariants[variant] || codemixButtonVariants.primary;
  const Tag = href ? "a" : "button";
  const off = disabled || loading;
  const a11y = Tag === "button" ? {
    type: type || "button",
    disabled: off
  } : {
    href: off ? undefined : href,
    "aria-disabled": off || undefined,
    tabIndex: off ? -1 : undefined
  };
  return /*#__PURE__*/React.createElement(Tag, _extends({}, a11y, {
    "aria-busy": loading || undefined,
    onClick: off ? undefined : onClick,
    style: {
      ...codemixButtonBase,
      ...v,
      height: s.height,
      width: square ? s.height : block ? "100%" : undefined,
      fontSize: s.fs,
      opacity: disabled ? .45 : 1,
      cursor: off ? "not-allowed" : "pointer",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "var(--space-4)",
      padding: square ? 0 : s.pad,
      height: "100%"
    }
  }, loading && /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    className: "cmx-spin",
    style: {
      width: "1em",
      height: "1em",
      border: "2px solid currentColor",
      borderRightColor: "transparent",
      borderRadius: "50%",
      boxSizing: "border-box",
      display: "inline-block"
    }
  }), icon, children), arrow && !square && /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
      width: "26px",
      borderLeft: "1px solid rgba(0,0,0,.22)",
      boxShadow: "inset 1px 0 0 rgba(255,255,255,.28)",
      fontSize: "11px"
    }
  }, "\u25B8"));
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/LinkArrow.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const codemixLinkArrowStyle = {
  font: "var(--fw-regular) var(--fs-body-lg)/1.3 var(--font-sans)",
  color: "var(--link)",
  textDecoration: "none",
  display: "inline-flex",
  alignItems: "baseline",
  gap: "var(--space-3)",
  transition: "var(--transition-control)"
};
function LinkArrow({
  children,
  href = "#",
  glyph = "\u00BB",
  tone = "accent",
  onClick,
  style,
  ...rest
}) {
  const color = tone === "accent" ? "var(--link)" : tone === "onDark" ? "var(--text-on-dark)" : "var(--text-body)";
  return /*#__PURE__*/React.createElement("a", _extends({
    href: href,
    onClick: onClick,
    style: {
      ...codemixLinkArrowStyle,
      color,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", null, children), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      fontSize: ".9em"
    }
  }, glyph));
}
Object.assign(__ds_scope, { LinkArrow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/LinkArrow.jsx", error: String((e && e.message) || e) }); }

// components/core/Logo.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const codemixLogoSrc = {
  color: "assets/logo-codemix-color.png",
  white: "assets/logo-codemix-white.svg",
  dark: "assets/logo-codemix-dark.png",
  mark: "assets/mark-codemix-color.png"
};
function Logo({
  variant = "color",
  height = 40,
  assetBase = "",
  tagline,
  style,
  ...rest
}) {
  const src = (assetBase || "") + (codemixLogoSrc[variant] || codemixLogoSrc.color);
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: "inline-flex",
      alignItems: "flex-end",
      gap: "var(--space-6)",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: "codemix",
    style: {
      height: height + "px",
      width: "auto",
      display: "block"
    }
  }), tagline && /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--fw-light) var(--fs-body-sm)/1.3 var(--font-sans)",
      color: "var(--text-on-dark-muted)",
      paddingBottom: "2px"
    }
  }, tagline));
}
Object.assign(__ds_scope, { Logo });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Logo.jsx", error: String((e && e.message) || e) }); }

// components/core/SectionHeading.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function SectionHeading({
  lead,
  children,
  kicker,
  sub,
  tone = "light",
  align = "left",
  size = "md",
  style,
  ...rest
}) {
  const onDark = tone === "dark";
  const fs = size === "lg" ? "var(--fs-title-lg)" : size === "sm" ? "var(--fs-title-sm)" : "var(--fs-title-md)";
  return /*#__PURE__*/React.createElement("header", _extends({
    style: {
      textAlign: align,
      ...style
    }
  }, rest), kicker && /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--type-kicker)",
      letterSpacing: "var(--ls-kicker)",
      textTransform: "uppercase",
      color: "var(--text-accent)",
      marginBottom: "var(--space-3)"
    }
  }, kicker), /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      font: "var(--fw-light) " + fs + "/var(--lh-heading) var(--font-sans)",
      color: onDark ? "var(--text-on-dark)" : "var(--text-heading)"
    }
  }, lead && /*#__PURE__*/React.createElement("strong", {
    style: {
      fontWeight: "var(--fw-medium)"
    }
  }, lead, " "), children), sub && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "var(--space-3) 0 0",
      font: "var(--type-body)",
      color: onDark ? "var(--text-on-dark-muted)" : "var(--text-muted)"
    }
  }, sub));
}
Object.assign(__ds_scope, { SectionHeading });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/SectionHeading.jsx", error: String((e && e.message) || e) }); }

// components/data/Avatar.jsx
try { (() => {
const cmxAvatarPx = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 56
};
function Avatar({
  src,
  alt,
  name = "",
  size = "md",
  shape = "square",
  status,
  style
}) {
  const px = cmxAvatarPx[size] || 40;
  const r = shape === "circle" ? "50%" : "var(--radius-sm)";
  const initials = name.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]).join("").toUpperCase();
  const dot = Math.max(8, Math.round(px / 4));
  return /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      display: "inline-flex",
      flex: "none",
      ...style
    }
  }, src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: alt ?? name,
    width: px,
    height: px,
    style: {
      display: "block",
      width: px + "px",
      height: px + "px",
      objectFit: "cover",
      borderRadius: r
    }
  }) : /*#__PURE__*/React.createElement("span", {
    role: "img",
    "aria-label": alt ?? name,
    style: {
      width: px + "px",
      height: px + "px",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: r,
      background: "var(--graphite-800)",
      color: "var(--amber-300)",
      font: "var(--fw-semibold) " + Math.round(px * .4) + "px/1 var(--font-sans)"
    }
  }, initials), status && /*#__PURE__*/React.createElement("span", {
    role: "img",
    "aria-label": status === "online" ? "online" : "offline",
    style: {
      position: "absolute",
      right: "-2px",
      bottom: "-2px",
      width: dot + "px",
      height: dot + "px",
      borderRadius: "50%",
      background: status === "online" ? "var(--success-500)" : "var(--neutral-500)",
      border: "2px solid #fff"
    }
  }));
}
Object.assign(__ds_scope, { Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/data/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const cmxCardVariants = {
  default: {
    background: "var(--surface-card)",
    border: "1px solid var(--border-subtle)",
    boxShadow: "0 1px 2px rgba(0,0,0,.10)",
    color: "var(--text-body)"
  },
  flat: {
    background: "var(--neutral-050)",
    border: "1px solid var(--border-subtle)",
    boxShadow: "none",
    color: "var(--text-body)"
  },
  dark: {
    background: "var(--surface-card-dark)",
    border: "1px solid var(--border-on-dark)",
    boxShadow: "none",
    color: "var(--text-on-dark)"
  }
};
function Card({
  title,
  subtitle,
  media,
  mediaAlt = "",
  children,
  actions,
  headingLevel = 3,
  variant = "default",
  href,
  side = false,
  style,
  ...rest
}) {
  const H = "h" + Math.min(6, Math.max(2, headingLevel));
  const dark = variant === "dark";
  const v = cmxCardVariants[variant] || cmxCardVariants.default;
  return /*#__PURE__*/React.createElement("article", _extends({
    style: {
      display: "flex",
      flexDirection: side ? "row" : "column",
      borderRadius: "var(--radius-md)",
      overflow: "hidden",
      position: "relative",
      ...v,
      ...style
    }
  }, rest), media && (typeof media === "string" ? /*#__PURE__*/React.createElement("img", {
    src: media,
    alt: mediaAlt,
    style: {
      display: "block",
      width: side ? "40%" : "100%",
      aspectRatio: side ? undefined : "16/9",
      objectFit: "cover",
      flex: "none"
    }
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      flex: "none",
      width: side ? "40%" : undefined
    }
  }, media)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-4)",
      padding: "var(--space-6) var(--space-7)",
      flex: 1,
      minWidth: 0
    }
  }, title && /*#__PURE__*/React.createElement(H, {
    style: {
      margin: 0,
      font: "var(--fw-medium) var(--fs-title-sm)/1.2 var(--font-sans)",
      color: dark ? "var(--text-on-dark)" : "var(--text-heading)"
    }
  }, href ? /*#__PURE__*/React.createElement("a", {
    href: href,
    style: {
      color: "inherit",
      textDecoration: "none"
    }
  }, title) : title), subtitle && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      font: "var(--fs-body-sm)/1.4 var(--font-sans)",
      color: dark ? "var(--text-on-dark-muted)" : "var(--text-muted-aa)"
    }
  }, subtitle), children && /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--type-body)"
    }
  }, children), actions && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: "var(--space-4)",
      marginTop: "auto",
      paddingTop: "var(--space-3)"
    }
  }, actions)));
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/Card.jsx", error: String((e && e.message) || e) }); }

// components/data/Divider.jsx
try { (() => {
function Divider({
  label,
  orientation = "horizontal",
  tone = "subtle",
  style
}) {
  const c = tone === "brand" ? "var(--grad-brand)" : tone === "strong" ? "var(--border-strong)" : "var(--border-subtle)";
  const t = tone === "brand" ? "2px" : "1px";
  if (orientation === "vertical") return /*#__PURE__*/React.createElement("span", {
    role: "separator",
    "aria-orientation": "vertical",
    style: {
      alignSelf: "stretch",
      width: t,
      minHeight: "1em",
      background: c,
      ...style
    }
  });
  if (!label) return /*#__PURE__*/React.createElement("hr", {
    style: {
      border: 0,
      height: t,
      background: c,
      margin: "var(--space-6) 0",
      ...style
    }
  });
  return /*#__PURE__*/React.createElement("div", {
    role: "separator",
    style: {
      display: "flex",
      alignItems: "center",
      gap: "var(--space-5)",
      margin: "var(--space-6) 0",
      font: "var(--fw-semibold) var(--fs-caption)/1 var(--font-sans)",
      letterSpacing: "var(--ls-kicker)",
      textTransform: "uppercase",
      color: "var(--text-muted-aa)",
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      flex: 1,
      height: t,
      background: c
    }
  }), label, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      flex: 1,
      height: t,
      background: c
    }
  }));
}
Object.assign(__ds_scope, { Divider });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/Divider.jsx", error: String((e && e.message) || e) }); }

// components/data/Kbd.jsx
try { (() => {
function Kbd({
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("kbd", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      minWidth: "22px",
      height: "22px",
      padding: "0 6px",
      boxSizing: "border-box",
      border: "1px solid var(--border-strong)",
      borderBottomWidth: "2px",
      borderRadius: "var(--radius-xs)",
      background: "linear-gradient(180deg,#fff 0%,#f0f0f0 100%)",
      font: "var(--fw-medium) 12px/1 var(--font-mono)",
      color: "var(--text-body)",
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { Kbd });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/Kbd.jsx", error: String((e && e.message) || e) }); }

// components/data/Stats.jsx
try { (() => {
function Stats({
  items = [],
  variant = "light",
  style
}) {
  const dark = variant === "dark";
  return /*#__PURE__*/React.createElement("dl", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))",
      margin: 0,
      background: dark ? "var(--surface-card-dark)" : "#fff",
      border: "1px solid " + (dark ? "var(--border-on-dark)" : "var(--border-subtle)"),
      borderRadius: "var(--radius-md)",
      overflow: "hidden",
      ...style
    }
  }, items.map((s, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-2)",
      padding: "var(--space-6) var(--space-7)",
      borderLeft: i ? "1px solid " + (dark ? "var(--border-on-dark)" : "var(--border-subtle)") : 0
    }
  }, /*#__PURE__*/React.createElement("dt", {
    style: {
      font: "var(--fw-semibold) var(--fs-caption)/1.2 var(--font-sans)",
      letterSpacing: "var(--ls-kicker)",
      textTransform: "uppercase",
      color: dark ? "var(--text-on-dark-muted)" : "var(--text-muted-aa)"
    }
  }, s.label), /*#__PURE__*/React.createElement("dd", {
    style: {
      margin: 0,
      font: "var(--fw-bold) var(--fs-display-sm)/1 var(--font-display)",
      color: dark ? "var(--amber-300)" : "var(--text-heading)",
      fontVariantNumeric: "tabular-nums"
    }
  }, s.value), s.desc && /*#__PURE__*/React.createElement("dd", {
    style: {
      margin: 0,
      font: "var(--fs-caption)/1.3 var(--font-sans)",
      color: s.trend === "up" ? dark ? "#9fd67a" : "var(--success-700)" : s.trend === "down" ? dark ? "#f2a196" : "var(--danger-700)" : dark ? "var(--text-on-dark-muted)" : "var(--text-muted-aa)"
    }
  }, s.trend && /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true"
  }, s.trend === "up" ? "\u25B2 " : "\u25BC "), s.desc))));
}
Object.assign(__ds_scope, { Stats });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/Stats.jsx", error: String((e && e.message) || e) }); }

// components/data/Table.jsx
try { (() => {
function Table({
  caption,
  captionHidden = false,
  columns = [],
  rows = [],
  rowHeader,
  zebra = false,
  hover = true,
  size = "md",
  style
}) {
  const pad = size === "sm" ? "6px 12px" : "10px 16px";
  const al = c => c.align || (c.numeric ? "right" : "left");
  return /*#__PURE__*/React.createElement("div", {
    role: "region",
    "aria-label": typeof caption === "string" ? caption : undefined,
    tabIndex: 0,
    style: {
      overflowX: "auto",
      background: "#fff",
      border: "1px solid var(--border-subtle)",
      borderRadius: "var(--radius-md)",
      ...style
    }
  }, /*#__PURE__*/React.createElement("table", {
    className: hover ? "cmx-row-hover" : undefined,
    style: {
      width: "100%",
      borderCollapse: "collapse",
      font: "var(--fs-body-sm)/1.4 var(--font-sans)",
      color: "var(--text-body)"
    }
  }, caption && /*#__PURE__*/React.createElement("caption", {
    className: captionHidden ? "cmx-sr-only" : undefined,
    style: captionHidden ? undefined : {
      textAlign: "left",
      padding: "12px 16px",
      font: "var(--fw-medium) var(--fs-body)/1.3 var(--font-sans)",
      color: "var(--text-heading)"
    }
  }, caption), /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, columns.map(c => /*#__PURE__*/React.createElement("th", {
    key: c.key,
    scope: "col",
    style: {
      textAlign: al(c),
      padding: pad,
      whiteSpace: "nowrap",
      background: "linear-gradient(180deg,#f2f2f2 0%,#fbfbfb 100%)",
      borderTop: caption && !captionHidden ? "1px solid var(--border-subtle)" : 0,
      borderBottom: "1px solid var(--border-strong)",
      font: "var(--fw-semibold) var(--fs-caption)/1.2 var(--font-sans)",
      letterSpacing: ".04em",
      textTransform: "uppercase",
      color: "var(--text-body)"
    }
  }, c.label)))), /*#__PURE__*/React.createElement("tbody", null, rows.map((r, ri) => /*#__PURE__*/React.createElement("tr", {
    key: r.id ?? ri,
    style: {
      background: zebra && ri % 2 ? "var(--neutral-050)" : undefined
    }
  }, columns.map(c => {
    const Cell = c.key === rowHeader ? "th" : "td";
    return /*#__PURE__*/React.createElement(Cell, {
      key: c.key,
      scope: Cell === "th" ? "row" : undefined,
      style: {
        textAlign: al(c),
        padding: pad,
        borderTop: ri ? "1px solid var(--border-subtle)" : 0,
        fontWeight: Cell === "th" ? "var(--fw-medium)" : "var(--fw-regular)",
        fontVariantNumeric: c.numeric ? "tabular-nums" : undefined
      }
    }, r[c.key]);
  }))))));
}
Object.assign(__ds_scope, { Table });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/Table.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Alert.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const cmxAlertTones = {
  info: {
    bg: "var(--info-100)",
    bd: "var(--info-700)",
    fg: "var(--info-700)",
    glyph: "i"
  },
  success: {
    bg: "var(--success-100)",
    bd: "var(--success-700)",
    fg: "var(--success-700)",
    glyph: "\u2713"
  },
  warning: {
    bg: "var(--warning-100)",
    bd: "var(--orange-700)",
    fg: "var(--orange-800)",
    glyph: "!"
  },
  error: {
    bg: "var(--danger-100)",
    bd: "var(--danger-700)",
    fg: "var(--danger-700)",
    glyph: "\u00D7"
  },
  neutral: {
    bg: "var(--surface-card)",
    bd: "var(--slate-500)",
    fg: "var(--text-heading)",
    glyph: "\u2022"
  }
};
function Alert({
  tone = "info",
  title,
  children,
  action,
  onDismiss,
  dismissLabel = "Fechar aviso",
  live = true,
  style,
  ...rest
}) {
  const t = cmxAlertTones[tone] || cmxAlertTones.info;
  const role = !live ? undefined : tone === "error" || tone === "warning" ? "alert" : "status";
  return /*#__PURE__*/React.createElement("div", _extends({
    role: role,
    style: {
      display: "grid",
      gridTemplateColumns: "auto minmax(0,1fr) auto",
      gap: "var(--space-5)",
      alignItems: "start",
      padding: "var(--space-5) var(--space-6)",
      background: t.bg,
      border: "1px solid " + t.bd,
      borderRadius: "var(--radius-sm)",
      font: "var(--type-body)",
      color: "var(--text-body)",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      width: "20px",
      height: "20px",
      marginTop: "1px",
      borderRadius: "var(--radius-xs)",
      background: t.bd,
      color: "#fff",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      font: "var(--fw-bold) 12px/1 var(--font-sans)"
    }
  }, t.glyph), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, title && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontWeight: "var(--fw-semibold)",
      color: t.fg
    }
  }, title), children && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: title ? "var(--space-1)" : 0
    }
  }, children), action && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "var(--space-4)",
      flexWrap: "wrap",
      marginTop: "var(--space-4)"
    }
  }, action)), onDismiss ? /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onDismiss,
    "aria-label": dismissLabel,
    style: {
      width: "var(--target-min)",
      height: "var(--target-min)",
      border: 0,
      padding: 0,
      background: "transparent",
      color: "var(--text-body)",
      cursor: "pointer",
      fontSize: "18px",
      lineHeight: 1,
      borderRadius: "var(--radius-xs)"
    }
  }, "\u00D7") : /*#__PURE__*/React.createElement("span", null));
}
Object.assign(__ds_scope, { Alert });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Alert.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Loading.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const cmxLoadingSize = {
  xs: 12,
  sm: 16,
  md: 24,
  lg: 36
};
const cmxLoadingTone = {
  brand: "var(--orange-700)",
  dark: "var(--graphite-800)",
  light: "#ffffff"
};
function Loading({
  size = "md",
  tone = "brand",
  label = "Carregando",
  showLabel = false,
  style,
  ...rest
}) {
  const px = cmxLoadingSize[size] || 24;
  return /*#__PURE__*/React.createElement("span", _extends({
    role: "status",
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "var(--space-4)",
      color: cmxLoadingTone[tone] || cmxLoadingTone.brand,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    className: "cmx-spin",
    style: {
      display: "inline-block",
      width: px + "px",
      height: px + "px",
      boxSizing: "border-box",
      borderRadius: "50%",
      border: Math.max(2, Math.round(px / 8)) + "px solid currentColor",
      borderRightColor: "transparent"
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: showLabel ? undefined : "cmx-sr-only",
    style: showLabel ? {
      font: "var(--fs-body-sm)/1 var(--font-sans)",
      color: tone === "light" ? "var(--text-on-dark)" : "var(--text-body)"
    } : undefined
  }, label));
}
Object.assign(__ds_scope, { Loading });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Loading.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Progress.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Progress({
  value,
  max = 100,
  label,
  showValue = false,
  tone = "brand",
  size = "md",
  style,
  ...rest
}) {
  const id = React.useId();
  const pct = value == null ? null : Math.round(value / max * 100);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: "var(--space-3)",
      ...style
    }
  }, (label || showValue) && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      gap: "var(--space-5)",
      font: "var(--fs-body-sm)/1.3 var(--font-sans)",
      color: "var(--text-body)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    id: id
  }, label), showValue && pct != null && /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      fontVariantNumeric: "tabular-nums",
      fontWeight: "var(--fw-medium)"
    }
  }, pct, "%")), /*#__PURE__*/React.createElement("progress", _extends({
    className: "cmx-progress cmx-progress--" + tone,
    "aria-labelledby": label ? id : undefined,
    value: value == null ? undefined : value,
    max: max,
    style: {
      height: size === "sm" ? "6px" : size === "lg" ? "14px" : "10px"
    }
  }, rest), pct != null ? pct + "%" : ""));
}
Object.assign(__ds_scope, { Progress });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Progress.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Skeleton.jsx
try { (() => {
function Skeleton({
  width = "100%",
  height = "14px",
  shape = "rect",
  lines = 1,
  gap = "8px",
  style
}) {
  const r = shape === "circle" ? "50%" : shape === "text" ? "var(--radius-xs)" : "var(--radius-sm)";
  const one = (i, w) => /*#__PURE__*/React.createElement("span", {
    key: i,
    className: "cmx-skeleton",
    style: {
      width: w,
      height,
      borderRadius: r,
      ...style
    }
  });
  if (lines <= 1) return /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      display: "block"
    }
  }, one(0, width));
  return /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      display: "grid",
      gap
    }
  }, Array.from({
    length: lines
  }, (_, i) => one(i, i === lines - 1 ? "62%" : width)));
}
Object.assign(__ds_scope, { Skeleton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Skeleton.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Toast.jsx
try { (() => {
const cmxToastPos = {
  "top-start": {
    top: "16px",
    left: "16px"
  },
  "top-center": {
    top: "16px",
    left: "50%",
    transform: "translateX(-50%)"
  },
  "top-end": {
    top: "16px",
    right: "16px"
  },
  "bottom-start": {
    bottom: "16px",
    left: "16px"
  },
  "bottom-center": {
    bottom: "16px",
    left: "50%",
    transform: "translateX(-50%)"
  },
  "bottom-end": {
    bottom: "16px",
    right: "16px"
  }
};
function Toast({
  items = [],
  position = "bottom-end",
  onDismiss,
  fixed = true,
  label = "Notificações",
  style
}) {
  return /*#__PURE__*/React.createElement("section", {
    "aria-label": label,
    "aria-live": "polite",
    "aria-relevant": "additions",
    style: {
      position: fixed ? "fixed" : "relative",
      zIndex: "var(--z-toast)",
      display: "grid",
      gap: "var(--space-4)",
      width: "min(360px, calc(100vw - 32px))",
      ...(fixed ? cmxToastPos[position] : {}),
      ...style
    }
  }, items.map(it => /*#__PURE__*/React.createElement(__ds_scope.Alert, {
    key: it.id,
    tone: it.tone || "neutral",
    title: it.title,
    live: false,
    action: it.action,
    onDismiss: onDismiss ? () => onDismiss(it.id) : undefined,
    style: {
      boxShadow: "var(--shadow-raised)"
    }
  }, it.message)));
}
Object.assign(__ds_scope, { Toast });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Toast.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Tooltip.jsx
try { (() => {
const cmxTipPos = {
  top: {
    bottom: "calc(100% + 8px)",
    left: "50%",
    transform: "translateX(-50%)"
  },
  bottom: {
    top: "calc(100% + 8px)",
    left: "50%",
    transform: "translateX(-50%)"
  },
  left: {
    right: "calc(100% + 8px)",
    top: "50%",
    transform: "translateY(-50%)"
  },
  right: {
    left: "calc(100% + 8px)",
    top: "50%",
    transform: "translateY(-50%)"
  }
};
function Tooltip({
  content,
  children,
  placement = "top",
  open,
  style
}) {
  const id = React.useId();
  const [inner, setInner] = React.useState(false);
  const shown = open ?? inner;
  React.useEffect(() => {
    if (!inner) return;
    const k = e => {
      if (e.key === "Escape") setInner(false);
    };
    document.addEventListener("keydown", k);
    return () => document.removeEventListener("keydown", k);
  }, [inner]);
  const child = React.isValidElement(children) ? React.cloneElement(children, {
    "aria-describedby": id
  }) : children;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      display: "inline-flex",
      ...style
    },
    onMouseEnter: () => setInner(true),
    onMouseLeave: () => setInner(false),
    onFocus: () => setInner(true),
    onBlur: () => setInner(false)
  }, child, /*#__PURE__*/React.createElement("span", {
    role: "tooltip",
    id: id,
    style: {
      position: "absolute",
      ...(cmxTipPos[placement] || cmxTipPos.top),
      zIndex: "var(--z-tooltip)",
      background: "var(--charcoal-900)",
      color: "var(--text-on-dark)",
      font: "var(--fs-caption)/1.35 var(--font-sans)",
      padding: "6px 8px",
      borderRadius: "var(--radius-xs)",
      whiteSpace: "nowrap",
      boxShadow: "var(--shadow-panel)",
      pointerEvents: "auto",
      opacity: shown ? 1 : 0,
      visibility: shown ? "visible" : "hidden",
      transition: "opacity var(--dur-fast) var(--ease-out)"
    }
  }, content));
}
Object.assign(__ds_scope, { Tooltip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Tooltip.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Checkbox({
  label,
  checked,
  defaultChecked = false,
  indeterminate = false,
  onChange,
  disabled = false,
  style,
  ...rest
}) {
  const ref = React.useRef(null);
  const [inner, setInner] = React.useState(defaultChecked);
  const on = checked ?? inner;
  React.useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate;
  }, [indeterminate]);
  const filled = on || indeterminate;
  return /*#__PURE__*/React.createElement("label", {
    style: {
      position: "relative",
      display: "inline-flex",
      alignItems: "center",
      gap: "var(--space-5)",
      minHeight: "var(--target-min)",
      font: "var(--type-body)",
      color: "var(--text-body)",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? .5 : 1,
      ...style
    }
  }, /*#__PURE__*/React.createElement("input", _extends({
    ref: ref,
    type: "checkbox",
    className: "cmx-peer cmx-sr-only",
    checked: on,
    disabled: disabled,
    onChange: e => {
      if (checked === undefined) setInner(e.target.checked);
      onChange && onChange(e);
    }
  }, rest)), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      flex: "none",
      width: "18px",
      height: "18px",
      boxSizing: "border-box",
      borderRadius: "var(--radius-xs)",
      border: "1px solid " + (filled ? "var(--orange-700)" : "var(--slate-500)"),
      background: filled ? "var(--grad-brand)" : "linear-gradient(180deg,#fff 0%,#f0f0f0 100%)",
      boxShadow: "var(--shadow-inset-field)",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      color: "var(--text-on-brand)",
      fontSize: "12px",
      fontWeight: 700,
      lineHeight: 1
    }
  }, indeterminate ? "\u2013" : on ? "\u2713" : ""), label);
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/Field.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Field({
  label,
  children,
  layout = "row",
  hint,
  required = false,
  style,
  ...rest
}) {
  const row = layout === "row";
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: row ? "grid" : "block",
      gridTemplateColumns: row ? "92px 1fr" : undefined,
      alignItems: "center",
      gap: row ? "var(--space-6)" : undefined,
      marginBottom: "var(--space-5)",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("label", {
    style: {
      font: "var(--fw-regular) var(--fs-body-lg)/1.2 var(--font-sans)",
      color: "var(--text-muted)",
      display: "block",
      marginBottom: row ? 0 : "var(--space-3)",
      textAlign: row ? "left" : "left"
    }
  }, label, required && /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--text-accent)"
    }
  }, " *")), /*#__PURE__*/React.createElement("div", null, children, hint && /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--fw-regular) var(--fs-caption)/1.4 var(--font-sans)",
      color: "var(--text-muted)",
      marginTop: "var(--space-3)"
    }
  }, hint)));
}
Object.assign(__ds_scope, { Field });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Field.jsx", error: String((e && e.message) || e) }); }

// components/forms/Fieldset.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Fieldset({
  legend,
  hint,
  error,
  children,
  direction = "column",
  bordered = true,
  style,
  ...rest
}) {
  const id = React.useId();
  const msg = error || hint;
  return /*#__PURE__*/React.createElement("fieldset", _extends({
    "aria-describedby": msg ? id : undefined,
    style: {
      minWidth: 0,
      margin: 0,
      padding: bordered ? "var(--space-4) var(--space-6) var(--space-6)" : 0,
      border: bordered ? "1px solid " + (error ? "var(--danger-500)" : "var(--border-subtle)") : 0,
      borderRadius: "var(--radius-md)",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("legend", {
    style: {
      padding: bordered ? "0 var(--space-3)" : 0,
      marginBottom: bordered ? 0 : "var(--space-4)",
      font: "var(--fw-semibold) var(--fs-body-sm)/1.2 var(--font-sans)",
      color: "var(--text-heading)"
    }
  }, legend), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: direction,
      flexWrap: "wrap",
      gap: direction === "row" ? "var(--space-3) var(--space-7)" : "var(--space-2)"
    }
  }, children), msg && /*#__PURE__*/React.createElement("p", {
    id: id,
    role: error ? "alert" : undefined,
    style: {
      margin: "var(--space-4) 0 0",
      font: "var(--fs-caption)/1.4 var(--font-sans)",
      color: error ? "var(--danger-700)" : "var(--text-muted-aa)"
    }
  }, msg));
}
Object.assign(__ds_scope, { Fieldset });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Fieldset.jsx", error: String((e && e.message) || e) }); }

// components/forms/FileInput.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function FileInput({
  accept,
  multiple = false,
  disabled = false,
  invalid = false,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("input", _extends({
    type: "file",
    className: "cmx-file",
    accept: accept,
    multiple: multiple,
    disabled: disabled,
    "aria-invalid": invalid || undefined,
    style: {
      boxSizing: "border-box",
      maxWidth: "100%",
      width: "100%",
      height: "var(--control-h)",
      padding: "3px",
      font: "var(--fs-body-sm)/1 var(--font-sans)",
      color: "var(--text-body)",
      background: "#fff",
      border: "1px solid " + (invalid ? "var(--danger-500)" : "var(--border-strong)"),
      borderRadius: "var(--radius-lg)",
      boxShadow: "var(--shadow-inset-field)",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? .5 : 1,
      ...style
    }
  }, rest));
}
Object.assign(__ds_scope, { FileInput });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/FileInput.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const codemixInputStyle = {
  width: "100%",
  boxSizing: "border-box",
  height: "var(--control-h)",
  padding: "0 var(--space-5)",
  font: "var(--type-body)",
  color: "var(--text-body)",
  background: "var(--neutral-000)",
  border: "1px solid var(--border-subtle)",
  borderRadius: "var(--radius-lg)",
  boxShadow: "var(--shadow-inset-field)",
  outline: "none",
  transition: "var(--transition-control)"
};
function Input({
  invalid = false,
  disabled = false,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("input", _extends({
    disabled: disabled,
    style: {
      ...codemixInputStyle,
      borderColor: invalid ? "var(--danger-500)" : "var(--border-subtle)",
      background: disabled ? "var(--neutral-100)" : "var(--neutral-000)",
      ...style
    }
  }, rest));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Radio.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Radio({
  label,
  name,
  value,
  checked,
  defaultChecked,
  onChange,
  disabled = false,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "var(--space-4)",
      minHeight: "var(--target-min)",
      font: "var(--type-body)",
      color: "var(--text-body)",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? .5 : 1,
      ...style
    }
  }, /*#__PURE__*/React.createElement("input", _extends({
    type: "radio",
    name: name,
    value: value,
    checked: checked,
    defaultChecked: defaultChecked,
    onChange: onChange,
    disabled: disabled,
    style: {
      width: "18px",
      height: "18px",
      margin: 0,
      accentColor: "var(--orange-800)",
      cursor: "inherit",
      flex: "none"
    }
  }, rest)), label);
}
Object.assign(__ds_scope, { Radio });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Radio.jsx", error: String((e && e.message) || e) }); }

// components/forms/Range.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Range({
  label,
  min = 0,
  max = 100,
  step = 1,
  value,
  defaultValue,
  onChange,
  showValue = true,
  unit = "",
  disabled = false,
  style,
  ...rest
}) {
  const id = React.useId();
  const [inner, setInner] = React.useState(defaultValue ?? min);
  const cur = value ?? inner;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: "var(--space-2)",
      opacity: disabled ? .5 : 1,
      ...style
    }
  }, (label || showValue) && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      gap: "var(--space-5)",
      font: "var(--fs-body-sm)/1.3 var(--font-sans)",
      color: "var(--text-body)"
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: id
  }, label), showValue && /*#__PURE__*/React.createElement("output", {
    htmlFor: id,
    style: {
      fontVariantNumeric: "tabular-nums",
      fontWeight: "var(--fw-medium)"
    }
  }, cur, unit)), /*#__PURE__*/React.createElement("input", _extends({
    id: id,
    type: "range",
    min: min,
    max: max,
    step: step,
    value: cur,
    disabled: disabled,
    "aria-valuetext": unit ? cur + unit : undefined,
    onChange: e => {
      if (value === undefined) setInner(+e.target.value);
      onChange && onChange(e);
    },
    style: {
      width: "100%",
      height: "var(--target-min)",
      margin: 0,
      accentColor: "var(--orange-800)",
      cursor: disabled ? "not-allowed" : "pointer"
    }
  }, rest)));
}
Object.assign(__ds_scope, { Range });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Range.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const codemixSelectStyle = {
  width: "100%",
  boxSizing: "border-box",
  height: "var(--control-h)",
  padding: "0 var(--space-5)",
  font: "var(--type-body)",
  color: "var(--text-body)",
  background: "var(--neutral-000)",
  border: "1px solid var(--border-subtle)",
  borderRadius: "var(--radius-lg)",
  boxShadow: "var(--shadow-inset-field)",
  outline: "none",
  transition: "var(--transition-control)"
};
function Select({
  options = [],
  placeholder,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("select", _extends({
    style: {
      ...codemixSelectStyle,
      appearance: "none",
      backgroundImage: "linear-gradient(180deg,#fff 0%,#f2f2f2 100%)",
      paddingRight: "var(--space-9)",
      ...style
    }
  }, rest), placeholder && /*#__PURE__*/React.createElement("option", {
    value: ""
  }, placeholder), options.map(o => typeof o === "string" ? /*#__PURE__*/React.createElement("option", {
    key: o,
    value: o
  }, o) : /*#__PURE__*/React.createElement("option", {
    key: o.value,
    value: o.value
  }, o.label)));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Textarea.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const codemixTextareaStyle = {
  width: "100%",
  boxSizing: "border-box",
  minHeight: "120px",
  padding: "var(--space-5)",
  font: "var(--type-body)",
  color: "var(--text-body)",
  background: "var(--neutral-000)",
  border: "1px solid var(--border-subtle)",
  borderRadius: "var(--radius-lg)",
  boxShadow: "var(--shadow-inset-field)",
  outline: "none",
  resize: "vertical"
};
function Textarea({
  rows = 6,
  invalid = false,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("textarea", _extends({
    rows: rows,
    style: {
      ...codemixTextareaStyle,
      borderColor: invalid ? "var(--danger-500)" : "var(--border-subtle)",
      ...style
    }
  }, rest));
}
Object.assign(__ds_scope, { Textarea });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Textarea.jsx", error: String((e && e.message) || e) }); }

// components/forms/Toggle.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Toggle({
  label,
  checked,
  defaultChecked = false,
  onChange,
  disabled = false,
  size = "md",
  style,
  ...rest
}) {
  const [inner, setInner] = React.useState(defaultChecked);
  const on = checked ?? inner;
  const w = size === "sm" ? 32 : 40,
    h = size === "sm" ? 18 : 22,
    k = h - 6;
  return /*#__PURE__*/React.createElement("label", {
    style: {
      position: "relative",
      display: "inline-flex",
      alignItems: "center",
      gap: "var(--space-5)",
      minHeight: "var(--target-min)",
      font: "var(--type-body)",
      color: "var(--text-body)",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? .5 : 1,
      ...style
    }
  }, /*#__PURE__*/React.createElement("input", _extends({
    type: "checkbox",
    role: "switch",
    className: "cmx-peer cmx-sr-only",
    checked: on,
    disabled: disabled,
    onChange: e => {
      if (checked === undefined) setInner(e.target.checked);
      onChange && onChange(e);
    }
  }, rest)), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      position: "relative",
      flex: "none",
      width: w + "px",
      height: h + "px",
      boxSizing: "border-box",
      borderRadius: "var(--radius-sm)",
      background: on ? "var(--orange-800)" : "var(--slate-500)",
      boxShadow: "var(--shadow-inset-field)",
      transition: "background-color var(--dur-base) var(--ease-standard)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      top: "3px",
      left: on ? w - k - 3 + "px" : "3px",
      width: k + "px",
      height: k + "px",
      borderRadius: "var(--radius-xs)",
      background: "#fff",
      boxShadow: "0 1px 2px rgba(0,0,0,.35)",
      transition: "left var(--dur-base) var(--ease-standard)"
    }
  })), label);
}
Object.assign(__ds_scope, { Toggle });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Toggle.jsx", error: String((e && e.message) || e) }); }

// components/layout/HighlightBar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function HighlightBar({
  children,
  right,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "var(--space-7)",
      minHeight: "var(--row-highlight)",
      padding: "0 var(--space-8)",
      background: "var(--grad-highlight-bar)",
      boxShadow: "inset 0 1px 0 rgba(255,255,255,.4),0 1px 3px rgba(0,0,0,.25)",
      font: "var(--fw-regular) var(--fs-body-sm)/1 var(--font-sans)",
      color: "var(--text-on-highlight)",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "var(--space-5)"
    }
  }, children), right && /*#__PURE__*/React.createElement("div", {
    style: {
      color: "rgba(43,43,43,.45)",
      font: "var(--fw-regular) var(--fs-body-sm)/1 var(--font-sans)"
    }
  }, right));
}
Object.assign(__ds_scope, { HighlightBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/layout/HighlightBar.jsx", error: String((e && e.message) || e) }); }

// components/layout/NavTabs.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function NavTabs({
  items = [],
  active,
  onSelect,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("nav", _extends({
    style: {
      display: "flex",
      alignItems: "flex-end",
      gap: 0,
      height: "var(--row-nav)",
      background: "linear-gradient(180deg,#3a3f42 0%,#2f3436 100%)",
      borderTop: "1px solid rgba(255,255,255,.08)",
      ...style
    }
  }, rest), items.map((it, i) => {
    const label = typeof it === "string" ? it : it.label;
    const on = (active ?? items[0]) === label || active === (typeof it === "string" ? it : it.value);
    return /*#__PURE__*/React.createElement("button", {
      key: label,
      onClick: () => onSelect && onSelect(label),
      style: {
        appearance: "none",
        border: 0,
        cursor: "pointer",
        height: on ? "var(--row-nav)" : "calc(var(--row-nav) - 2px)",
        padding: "0 var(--space-7)",
        font: "var(--type-nav)",
        letterSpacing: "var(--ls-nav)",
        color: on ? "var(--charcoal-900)" : "#d7d8da",
        background: on ? "var(--grad-highlight-bar)" : "transparent",
        borderTopLeftRadius: "var(--radius-sm)",
        borderTopRightRadius: "var(--radius-sm)",
        borderRight: on ? "none" : "1px solid rgba(255,255,255,.08)",
        transition: "var(--transition-control)"
      }
    }, label);
  }));
}
Object.assign(__ds_scope, { NavTabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/layout/NavTabs.jsx", error: String((e && e.message) || e) }); }

// components/layout/Panel.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Panel({
  title,
  titleLead,
  subtitle,
  children,
  tone = "light",
  padding = "var(--space-7)",
  style,
  ...rest
}) {
  const dark = tone === "dark";
  return /*#__PURE__*/React.createElement("section", _extends({
    style: {
      background: dark ? "var(--surface-card-dark)" : "var(--surface-card)",
      border: "1px solid " + (dark ? "var(--border-on-dark)" : "var(--border-subtle)"),
      borderRadius: "var(--radius-md)",
      boxShadow: dark ? "none" : "var(--shadow-card)",
      overflow: "hidden",
      ...style
    }
  }, rest), (title || subtitle) && /*#__PURE__*/React.createElement("header", {
    style: {
      padding: "var(--space-6) " + padding + " var(--space-5)",
      background: dark ? "linear-gradient(180deg,rgba(255,255,255,.05) 0%,rgba(255,255,255,0) 100%)" : "linear-gradient(180deg,#f2f2f2 0%,#fbfbfb 100%)",
      borderBottom: "1px solid " + (dark ? "var(--border-on-dark)" : "var(--border-subtle)")
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      font: "var(--fw-light) var(--fs-title-md)/1.1 var(--font-sans)",
      color: dark ? "var(--text-on-dark)" : "var(--text-heading)"
    }
  }, titleLead && /*#__PURE__*/React.createElement("strong", {
    style: {
      fontWeight: "var(--fw-medium)"
    }
  }, titleLead, " "), title), subtitle && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "var(--space-2)",
      font: "var(--fw-regular) var(--fs-body-sm)/1.3 var(--font-sans)",
      color: dark ? "var(--text-on-dark-muted)" : "var(--text-muted)"
    }
  }, subtitle)), /*#__PURE__*/React.createElement("div", {
    style: {
      padding
    }
  }, children));
}
Object.assign(__ds_scope, { Panel });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/layout/Panel.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Breadcrumbs.jsx
try { (() => {
function Breadcrumbs({
  items = [],
  label = "Trilha de navegação",
  separator = "/",
  style
}) {
  return /*#__PURE__*/React.createElement("nav", {
    "aria-label": label,
    style: style
  }, /*#__PURE__*/React.createElement("ol", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      alignItems: "center",
      gap: "var(--space-3)",
      margin: 0,
      padding: 0,
      listStyle: "none",
      font: "var(--fs-body-sm)/1.4 var(--font-sans)"
    }
  }, items.map((it, i) => {
    const last = i === items.length - 1;
    return /*#__PURE__*/React.createElement("li", {
      key: i,
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: "var(--space-3)"
      }
    }, last || !it.href ? /*#__PURE__*/React.createElement("span", {
      "aria-current": last ? "page" : undefined,
      style: {
        color: "var(--text-body)",
        fontWeight: last ? "var(--fw-medium)" : "var(--fw-regular)"
      }
    }, it.label) : /*#__PURE__*/React.createElement("a", {
      href: it.href,
      style: {
        color: "var(--link-aa)",
        textDecoration: "underline",
        textUnderlineOffset: "3px"
      }
    }, it.label), !last && /*#__PURE__*/React.createElement("span", {
      "aria-hidden": "true",
      style: {
        color: "var(--text-muted-aa)"
      }
    }, separator));
  })));
}
Object.assign(__ds_scope, { Breadcrumbs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Breadcrumbs.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Pagination.jsx
try { (() => {
function cmxPageRange(page, total, sib) {
  const out = [1];
  const s = Math.max(2, page - sib),
    e = Math.min(total - 1, page + sib);
  if (s > 2) out.push("gap-s");
  for (let i = s; i <= e; i++) out.push(i);
  if (e < total - 1) out.push("gap-e");
  if (total > 1) out.push(total);
  return out;
}
function Pagination({
  page = 1,
  total = 1,
  onChange,
  siblings = 1,
  label = "Paginação",
  prevLabel = "Página anterior",
  nextLabel = "Próxima página",
  style
}) {
  const btn = (active, disabled) => ({
    minWidth: "var(--control-h)",
    height: "var(--control-h)",
    padding: "0 var(--space-4)",
    boxSizing: "border-box",
    border: "1px solid " + (active ? "var(--orange-700)" : "var(--border-strong)"),
    borderRadius: "var(--radius-sm)",
    background: active ? "var(--grad-brand)" : "linear-gradient(180deg,#fdfdfd 0%,#e9e9e9 100%)",
    color: active ? "var(--text-on-brand)" : "var(--text-body)",
    font: (active ? "var(--fw-semibold)" : "var(--fw-medium)") + " var(--fs-body-sm)/1 var(--font-sans)",
    fontVariantNumeric: "tabular-nums",
    boxShadow: "var(--shadow-button)",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? .45 : 1
  });
  const go = p => onChange && onChange(p);
  return /*#__PURE__*/React.createElement("nav", {
    "aria-label": label,
    style: style
  }, /*#__PURE__*/React.createElement("ul", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: "var(--space-2)",
      margin: 0,
      padding: 0,
      listStyle: "none"
    }
  }, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": prevLabel,
    disabled: page <= 1,
    onClick: () => go(page - 1),
    style: btn(false, page <= 1)
  }, "\u2039")), cmxPageRange(page, total, siblings).map(p => typeof p === "string" ? /*#__PURE__*/React.createElement("li", {
    key: p,
    "aria-hidden": "true",
    style: {
      display: "inline-flex",
      alignItems: "center",
      padding: "0 var(--space-2)",
      color: "var(--text-muted-aa)"
    }
  }, "\u2026") : /*#__PURE__*/React.createElement("li", {
    key: p
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": "Página " + p,
    "aria-current": p === page ? "page" : undefined,
    onClick: () => go(p),
    style: btn(p === page, false)
  }, p))), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": nextLabel,
    disabled: page >= total,
    onClick: () => go(page + 1),
    style: btn(false, page >= total)
  }, "\u203A"))));
}
Object.assign(__ds_scope, { Pagination });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Pagination.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Steps.jsx
try { (() => {
function Steps({
  steps = [],
  current = 0,
  orientation = "horizontal",
  label = "Etapas",
  style
}) {
  const h = orientation === "horizontal";
  return /*#__PURE__*/React.createElement("ol", {
    "aria-label": label,
    style: {
      display: "flex",
      flexDirection: h ? "row" : "column",
      gap: h ? 0 : "var(--space-5)",
      margin: 0,
      padding: 0,
      listStyle: "none",
      ...style
    }
  }, steps.map((s, i) => {
    const st = i < current ? "done" : i === current ? "current" : "todo";
    const text = typeof s === "string" ? s : s.label;
    return /*#__PURE__*/React.createElement("li", {
      key: i,
      "aria-current": st === "current" ? "step" : undefined,
      style: {
        position: "relative",
        flex: h ? "1 1 0" : undefined,
        minWidth: 0,
        display: "flex",
        flexDirection: h ? "column" : "row",
        alignItems: "center",
        gap: "var(--space-4)",
        textAlign: h ? "center" : "left"
      }
    }, h && i > 0 && /*#__PURE__*/React.createElement("span", {
      "aria-hidden": "true",
      style: {
        position: "absolute",
        top: "13px",
        left: "-50%",
        right: "50%",
        height: "2px",
        background: st === "todo" ? "var(--neutral-400)" : "var(--orange-800)"
      }
    }), /*#__PURE__*/React.createElement("span", {
      "aria-hidden": "true",
      style: {
        position: "relative",
        zIndex: 1,
        flex: "none",
        width: "28px",
        height: "28px",
        boxSizing: "border-box",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "var(--radius-sm)",
        font: "var(--fw-semibold) 13px/1 var(--font-sans)",
        background: st === "todo" ? "#fff" : st === "current" ? "var(--grad-brand)" : "var(--graphite-800)",
        color: st === "todo" ? "var(--text-muted-aa)" : st === "current" ? "var(--text-on-brand)" : "#fff",
        border: "1px solid " + (st === "todo" ? "var(--slate-500)" : st === "current" ? "var(--orange-700)" : "var(--graphite-800)")
      }
    }, st === "done" ? "\u2713" : i + 1), /*#__PURE__*/React.createElement("span", {
      style: {
        font: "var(--fs-body-sm)/1.3 var(--font-sans)",
        fontWeight: st === "current" ? "var(--fw-semibold)" : "var(--fw-regular)",
        color: st === "todo" ? "var(--text-muted-aa)" : "var(--text-body)"
      }
    }, text, /*#__PURE__*/React.createElement("span", {
      className: "cmx-sr-only"
    }, st === "done" ? " — concluída" : st === "current" ? " — etapa atual" : " — pendente")));
  }));
}
Object.assign(__ds_scope, { Steps });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Steps.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Tabs.jsx
try { (() => {
function Tabs({
  tabs = [],
  value,
  defaultValue,
  onChange,
  variant = "line",
  label,
  style
}) {
  const [inner, setInner] = React.useState(defaultValue ?? (tabs[0] && tabs[0].id));
  const cur = value ?? inner;
  const base = React.useId();
  const refs = React.useRef([]);
  const enabled = tabs.map((t, i) => t.disabled ? null : i).filter(i => i !== null);
  const select = id => {
    if (value === undefined) setInner(id);
    onChange && onChange(id);
  };
  const onKey = (e, i) => {
    const p = enabled.indexOf(i);
    let n = null;
    if (e.key === "ArrowRight") n = enabled[(p + 1) % enabled.length];else if (e.key === "ArrowLeft") n = enabled[(p - 1 + enabled.length) % enabled.length];else if (e.key === "Home") n = enabled[0];else if (e.key === "End") n = enabled[enabled.length - 1];
    if (n != null) {
      e.preventDefault();
      refs.current[n].focus();
      select(tabs[n].id);
    }
  };
  const boxed = variant === "boxed";
  return /*#__PURE__*/React.createElement("div", {
    style: style
  }, /*#__PURE__*/React.createElement("div", {
    role: "tablist",
    "aria-label": label,
    style: {
      display: "flex",
      gap: boxed ? "var(--space-2)" : 0,
      overflowX: "auto",
      borderBottom: boxed ? 0 : "1px solid var(--border-strong)",
      background: boxed ? "var(--neutral-100)" : "transparent",
      padding: boxed ? "var(--space-2)" : 0,
      borderRadius: boxed ? "var(--radius-sm)" : 0,
      width: boxed ? "fit-content" : undefined,
      maxWidth: "100%"
    }
  }, tabs.map((t, i) => {
    const sel = t.id === cur;
    return /*#__PURE__*/React.createElement("button", {
      key: t.id,
      ref: el => refs.current[i] = el,
      type: "button",
      role: "tab",
      id: base + "t" + t.id,
      "aria-selected": sel,
      "aria-controls": base + "p" + t.id,
      tabIndex: sel ? 0 : -1,
      disabled: t.disabled,
      onClick: () => select(t.id),
      onKeyDown: e => onKey(e, i),
      style: boxed ? {
        height: "32px",
        padding: "0 var(--space-6)",
        border: 0,
        borderRadius: "var(--radius-xs)",
        background: sel ? "#fff" : "transparent",
        boxShadow: sel ? "var(--shadow-card)" : "none",
        font: "var(--fw-medium) var(--fs-body-sm)/1 var(--font-sans)",
        color: sel ? "var(--text-heading)" : "var(--text-muted-aa)",
        cursor: t.disabled ? "not-allowed" : "pointer",
        opacity: t.disabled ? .45 : 1,
        whiteSpace: "nowrap"
      } : {
        height: "40px",
        padding: "0 var(--space-6)",
        marginBottom: "-1px",
        border: 0,
        borderBottom: "3px solid " + (sel ? "var(--orange-800)" : "transparent"),
        background: "transparent",
        font: "var(--fw-medium) var(--fs-body)/1 var(--font-sans)",
        color: sel ? "var(--text-heading)" : "var(--text-muted-aa)",
        cursor: t.disabled ? "not-allowed" : "pointer",
        opacity: t.disabled ? .45 : 1,
        whiteSpace: "nowrap"
      }
    }, t.label);
  })), tabs.map(t => /*#__PURE__*/React.createElement("div", {
    key: t.id,
    role: "tabpanel",
    id: base + "p" + t.id,
    "aria-labelledby": base + "t" + t.id,
    hidden: t.id !== cur,
    tabIndex: 0,
    style: {
      padding: "var(--space-6) 0",
      font: "var(--type-body)",
      color: "var(--text-body)"
    }
  }, t.content)));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Tabs.jsx", error: String((e && e.message) || e) }); }

// components/overlay/Accordion.jsx
try { (() => {
function Accordion({
  items = [],
  exclusive = true,
  defaultOpen,
  variant = "joined",
  style
}) {
  const gid = React.useId();
  const sep = variant === "separated";
  const last = items.length - 1;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: sep ? "var(--space-4)" : 0,
      ...style
    }
  }, items.map((it, i) => /*#__PURE__*/React.createElement("details", {
    key: i,
    name: exclusive ? "cmx-acc" + gid : undefined,
    open: defaultOpen === i || !!it.open,
    style: {
      background: "#fff",
      border: "1px solid var(--border-subtle)",
      borderTopWidth: !sep && i > 0 ? 0 : "1px",
      borderRadius: sep ? "var(--radius-md)" : i === 0 && i === last ? "var(--radius-md)" : i === 0 ? "6px 6px 0 0" : i === last ? "0 0 6px 6px" : 0
    }
  }, /*#__PURE__*/React.createElement("summary", {
    className: "cmx-summary",
    style: {
      display: "flex",
      alignItems: "center",
      gap: "var(--space-5)",
      minHeight: "var(--target-comfort)",
      padding: "0 var(--space-6)",
      cursor: "pointer",
      font: "var(--fw-medium) var(--fs-body)/1.3 var(--font-sans)",
      color: "var(--text-heading)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    className: "cmx-chevron",
    style: {
      color: "var(--orange-800)",
      fontSize: "11px",
      transition: "transform var(--dur-fast) var(--ease-standard)"
    }
  }, "\u25B8"), it.title), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "0 var(--space-6) var(--space-6) 39px",
      font: "var(--type-body)",
      color: "var(--text-body)"
    }
  }, it.content))));
}
Object.assign(__ds_scope, { Accordion });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/overlay/Accordion.jsx", error: String((e && e.message) || e) }); }

// components/overlay/Dropdown.jsx
try { (() => {
function Dropdown({
  label,
  items = [],
  align = "start",
  defaultOpen = false,
  style
}) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const d = ref.current;
    if (!d) return;
    const out = e => {
      if (d.open && !d.contains(e.target)) d.open = false;
    };
    const esc = e => {
      if (e.key === "Escape" && d.open) {
        d.open = false;
        d.querySelector("summary").focus();
      }
    };
    document.addEventListener("click", out);
    d.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("click", out);
      d.removeEventListener("keydown", esc);
    };
  }, []);
  const close = () => {
    if (ref.current) ref.current.open = false;
  };
  const itemStyle = tone => ({
    display: "flex",
    alignItems: "center",
    gap: "var(--space-4)",
    width: "100%",
    minHeight: "32px",
    padding: "0 var(--space-5)",
    border: 0,
    background: "transparent",
    borderRadius: "var(--radius-xs)",
    font: "var(--fs-body)/1.2 var(--font-sans)",
    color: tone === "danger" ? "var(--danger-700)" : "var(--text-body)",
    textAlign: "left",
    textDecoration: "none",
    cursor: "pointer",
    boxSizing: "border-box"
  });
  return /*#__PURE__*/React.createElement("details", {
    ref: ref,
    open: defaultOpen,
    style: {
      position: "relative",
      display: "inline-block",
      ...style
    }
  }, /*#__PURE__*/React.createElement("summary", {
    className: "cmx-summary",
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "var(--space-4)",
      height: "var(--control-h)",
      padding: "0 var(--space-6)",
      border: "1px solid var(--border-strong)",
      borderRadius: "var(--radius-sm)",
      background: "linear-gradient(180deg,#fdfdfd 0%,#e9e9e9 100%)",
      boxShadow: "var(--shadow-button)",
      font: "var(--fw-medium) var(--fs-body)/1 var(--font-sans)",
      color: "var(--text-body)",
      cursor: "pointer",
      userSelect: "none"
    }
  }, label, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    className: "cmx-chevron",
    style: {
      fontSize: "10px",
      transition: "transform var(--dur-fast) var(--ease-standard)"
    }
  }, "\u25B8")), /*#__PURE__*/React.createElement("ul", {
    style: {
      position: "absolute",
      [align === "end" ? "right" : "left"]: 0,
      top: "calc(100% + 4px)",
      zIndex: "var(--z-dropdown)",
      minWidth: "100%",
      width: "max-content",
      margin: 0,
      padding: "var(--space-2)",
      listStyle: "none",
      background: "#fff",
      border: "1px solid var(--border-strong)",
      borderRadius: "var(--radius-sm)",
      boxShadow: "var(--shadow-panel)"
    }
  }, items.map((it, i) => it.divider ? /*#__PURE__*/React.createElement("li", {
    key: i,
    role: "separator",
    style: {
      height: "1px",
      background: "var(--border-subtle)",
      margin: "var(--space-2) 0"
    }
  }) : /*#__PURE__*/React.createElement("li", {
    key: i
  }, it.href ? /*#__PURE__*/React.createElement("a", {
    className: "cmx-item",
    href: it.href,
    onClick: close,
    style: itemStyle(it.tone)
  }, it.icon, it.label) : /*#__PURE__*/React.createElement("button", {
    className: "cmx-item",
    type: "button",
    disabled: it.disabled,
    onClick: () => {
      close();
      it.onSelect && it.onSelect();
    },
    style: {
      ...itemStyle(it.tone),
      opacity: it.disabled ? .45 : 1
    }
  }, it.icon, it.label)))));
}
Object.assign(__ds_scope, { Dropdown });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/overlay/Dropdown.jsx", error: String((e && e.message) || e) }); }

// components/overlay/Modal.jsx
try { (() => {
const cmxModalW = {
  sm: 400,
  md: 560,
  lg: 760
};
function Modal({
  open = false,
  onClose,
  title,
  children,
  actions,
  size = "md",
  closeLabel = "Fechar",
  dismissOnBackdrop = true,
  style
}) {
  const ref = React.useRef(null);
  const tid = React.useId();
  React.useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  React.useEffect(() => {
    const d = ref.current;
    if (!d) return;
    const h = () => onClose && onClose();
    d.addEventListener("close", h);
    return () => d.removeEventListener("close", h);
  }, [onClose]);
  return /*#__PURE__*/React.createElement("dialog", {
    ref: ref,
    className: "cmx-modal",
    "aria-labelledby": tid,
    onClick: e => {
      if (dismissOnBackdrop && e.target === ref.current) ref.current.close();
    },
    style: {
      padding: 0,
      border: "1px solid var(--border-strong)",
      borderRadius: "var(--radius-md)",
      width: "min(" + (cmxModalW[size] || 560) + "px, calc(100vw - 32px))",
      maxHeight: "calc(100vh - 64px)",
      boxShadow: "var(--shadow-raised)",
      background: "var(--surface-card)",
      color: "var(--text-body)",
      font: "var(--type-body)",
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("header", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "var(--space-6)",
      padding: "var(--space-5) var(--space-5) var(--space-5) var(--space-7)",
      borderBottom: "1px solid var(--border-subtle)",
      background: "linear-gradient(180deg,#f2f2f2 0%,#fbfbfb 100%)"
    }
  }, /*#__PURE__*/React.createElement("h2", {
    id: tid,
    style: {
      margin: 0,
      font: "var(--fw-medium) var(--fs-title-sm)/1.2 var(--font-sans)",
      color: "var(--text-heading)"
    }
  }, title), /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": closeLabel,
    onClick: () => ref.current.close(),
    style: {
      width: "32px",
      height: "32px",
      border: 0,
      padding: 0,
      background: "transparent",
      color: "var(--text-body)",
      fontSize: "22px",
      lineHeight: 1,
      cursor: "pointer",
      borderRadius: "var(--radius-xs)"
    }
  }, "\u00D7")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "var(--space-7)"
    }
  }, children), actions && /*#__PURE__*/React.createElement("footer", {
    style: {
      display: "flex",
      justifyContent: "flex-end",
      flexWrap: "wrap",
      gap: "var(--space-4)",
      padding: "var(--space-5) var(--space-7)",
      borderTop: "1px solid var(--border-subtle)"
    }
  }, actions)));
}
Object.assign(__ds_scope, { Modal });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/overlay/Modal.jsx", error: String((e && e.message) || e) }); }

// ui_kits/brand-banner/BannerSquare.jsx
try { (() => {
function BannerSquare({
  kicker = "desenvolvo seu produto com",
  headline = "Agentes e automações IA",
  services = "ui/ux design . desenvolvimento . seo e geo",
  size = 560
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: size + "px",
      height: size + "px",
      background: "var(--charcoal-900)",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/mark-codemix-color.png",
    alt: "",
    style: {
      position: "absolute",
      left: "-40px",
      bottom: "-60px",
      height: "330px",
      filter: "grayscale(1) brightness(2.4)",
      opacity: .055
    }
  }), /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo-codemix-white.svg",
    alt: "codemix",
    style: {
      position: "absolute",
      left: "40px",
      top: "36px",
      height: "40px"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: "40px",
      right: "40px",
      top: "170px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--fw-semibold) 18px/1 var(--font-display)",
      letterSpacing: ".07em",
      textTransform: "uppercase",
      color: "var(--amber-400)"
    }
  }, kicker), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "8px",
      font: "var(--fw-bold) 56px/1.02 var(--font-display)",
      textTransform: "uppercase",
      color: "#fefefe"
    }
  }, headline), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "16px",
      font: "var(--fw-regular) 17px/1.35 var(--font-display)",
      letterSpacing: ".06em",
      textTransform: "uppercase",
      color: "#8a8a8a"
    }
  }, services)));
}
Object.assign(window, {
  BannerSquare
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/brand-banner/BannerSquare.jsx", error: String((e && e.message) || e) }); }

// ui_kits/brand-banner/BannerWide.jsx
try { (() => {
function BannerWide({
  kicker = "desenvolvo seu produto com",
  headline = "Agentes e automações IA",
  services = "ui/ux design . desenvolvimento . seo e geo",
  stack = "typescript . n8n . supabase",
  width = 1584,
  height = 396
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: width + "px",
      height: height + "px",
      background: "var(--charcoal-900)",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/mark-codemix-color.png",
    alt: "",
    style: {
      position: "absolute",
      left: "14px",
      top: "148px",
      height: "286px",
      filter: "grayscale(1) brightness(2.4)",
      opacity: .055
    }
  }), /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo-codemix-white.svg",
    alt: "codemix",
    style: {
      position: "absolute",
      left: "42px",
      top: "40px",
      height: "52px"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      right: "52px",
      top: "58px",
      textAlign: "right"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "var(--fw-semibold) 26px/1 var(--font-display)",
      letterSpacing: ".05em",
      textTransform: "uppercase",
      color: "var(--amber-400)"
    }
  }, kicker), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "10px",
      font: "var(--fw-bold) 72px/1 var(--font-display)",
      letterSpacing: ".01em",
      textTransform: "uppercase",
      color: "#fefefe"
    }
  }, headline), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "18px",
      font: "var(--fw-regular) 27px/1.2 var(--font-display)",
      letterSpacing: ".05em",
      textTransform: "uppercase",
      color: "#8a8a8a"
    }
  }, services), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "6px",
      font: "var(--fw-regular) 27px/1.2 var(--font-display)",
      letterSpacing: ".05em",
      textTransform: "uppercase",
      color: "#494949"
    }
  }, stack)));
}
Object.assign(window, {
  BannerWide
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/brand-banner/BannerWide.jsx", error: String((e && e.message) || e) }); }

// ui_kits/codemix-web/AsidePitch.jsx
try { (() => {
function AsidePitch() {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: "var(--space-3)"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo-codemix-dark.png",
    alt: "codemix",
    style: {
      height: "18px",
      opacity: .85
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--fw-light) var(--fs-body-lg)/1 var(--font-sans)",
      color: "var(--text-muted)"
    }
  }, ". development solutions")), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "var(--space-5) 0 0",
      font: "var(--fw-regular) var(--fs-body-sm)/1.55 var(--font-sans)",
      color: "var(--text-body)"
    }
  }, "Vendemos solu\xE7\xF5es para problemas de organiza\xE7\xE3o, comunica\xE7\xE3o, produ\xE7\xE3o, estrat\xE9gia e marketing para empresas que seguem os avan\xE7os tecnol\xF3gicos e log\xEDsticos."));
}
Object.assign(window, {
  AsidePitch
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/codemix-web/AsidePitch.jsx", error: String((e && e.message) || e) }); }

// ui_kits/codemix-web/ContactScreen.jsx
try { (() => {
const {
  SectionHeading,
  LinkArrow,
  Panel,
  Field,
  Input,
  Textarea,
  Button,
  MediaLinkList
} = window.CodemixDesignSystem_95bbea;
function ContactScreen() {
  const [sent, setSent] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--container-max)",
      margin: "0 auto",
      padding: "var(--space-9) var(--container-gutter) var(--space-12)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 288px",
      gap: "var(--space-10)",
      alignItems: "start"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionHeading, {
    lead: "Fale conosco",
    size: "lg",
    sub: "Encontre a solu\xE7\xE3o ideal para a sua empresa"
  }, "e tire todas as suas d\xFAvidas sobre os gerenciadores."), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "var(--space-5) 0 var(--space-9)"
    }
  }, /*#__PURE__*/React.createElement(LinkArrow, null, "Consulte nossos planos")), /*#__PURE__*/React.createElement("form", {
    onSubmit: e => {
      e.preventDefault();
      setSent(true);
    },
    style: {
      maxWidth: "600px"
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Nome"
  }, /*#__PURE__*/React.createElement(Input, {
    required: true
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Email"
  }, /*#__PURE__*/React.createElement(Input, {
    type: "email",
    required: true
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Tel"
  }, /*#__PURE__*/React.createElement(Input, null)), /*#__PURE__*/React.createElement(Field, {
    label: "Assunto"
  }, /*#__PURE__*/React.createElement(Input, null)), /*#__PURE__*/React.createElement(Field, {
    label: "Msg"
  }, /*#__PURE__*/React.createElement(Textarea, {
    rows: 7
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "var(--space-7)",
      paddingLeft: "104px"
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    arrow: true,
    type: "submit"
  }, "enviar"), sent && /*#__PURE__*/React.createElement("span", {
    style: {
      font: "var(--type-body)",
      color: "var(--success-500)"
    }
  }, "Mensagem enviada. Responderemos em breve.")))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: "var(--space-8)"
    }
  }, /*#__PURE__*/React.createElement(AsidePitch, null), /*#__PURE__*/React.createElement(Panel, {
    titleLead: "Flash",
    title: "tutoriais",
    padding: "var(--space-4)"
  }, /*#__PURE__*/React.createElement(MediaLinkList, {
    items: [{
      label: "UtJuris",
      meta: "",
      kind: "flash"
    }, {
      label: "E-agency",
      meta: "",
      kind: "flash"
    }, {
      label: "Mapa de Imóveis",
      meta: "",
      kind: "flash"
    }, {
      label: "Codemix",
      meta: "",
      kind: "flash"
    }]
  })), /*#__PURE__*/React.createElement(Panel, {
    titleLead: "Imagens",
    title: "software",
    padding: "var(--space-6)"
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      font: "var(--fw-regular) var(--fs-body-sm)/1.5 var(--font-sans)",
      color: "var(--text-muted)"
    }
  }, "Telas dos gerenciadores em alta resolu\xE7\xE3o.")))));
}
Object.assign(window, {
  ContactScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/codemix-web/ContactScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/codemix-web/HeroBand.jsx
try { (() => {
const {
  BulletList,
  Button
} = window.CodemixDesignSystem_95bbea;
function HeroBand() {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: "var(--grad-chrome)",
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: "radial-gradient(90% 120% at 40% 20%,rgba(255,255,255,.05) 0%,rgba(255,255,255,0) 60%)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--container-max)",
      margin: "0 auto",
      padding: "0 var(--container-gutter)",
      display: "grid",
      gridTemplateColumns: "1fr 306px",
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "270px 1fr",
      alignItems: "center",
      gap: "var(--space-6)",
      padding: "var(--space-7) 0"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/hero-stack.png",
    alt: "Telas dos gerenciadores codemix",
    style: {
      width: "270px",
      display: "block",
      mixBlendMode: "lighten"
    }
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      font: "var(--fw-light) 21px/1.35 var(--font-sans)",
      color: "var(--text-on-dark-muted)"
    }
  }, "Simplesmente,"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "var(--space-3) 0 var(--space-7)",
      font: "var(--fw-light) 21px/1.35 var(--font-sans)",
      color: "var(--text-on-dark)"
    }
  }, "as ferramentas mais poderosas", /*#__PURE__*/React.createElement("br", null), "de gerenciamento de conte\xFAdo na internet."), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    arrow: true
  }, "saiba mais"))), /*#__PURE__*/React.createElement("aside", {
    style: {
      background: "rgba(255,255,255,.04)",
      borderLeft: "1px solid var(--border-on-dark)",
      padding: "var(--space-7) var(--space-8)",
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      font: "var(--fw-regular) 19px/1.2 var(--font-sans)",
      letterSpacing: ".02em",
      textTransform: "uppercase",
      color: "var(--amber-400)"
    }
  }, "Conhe\xE7a as vantagens"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "var(--space-3) 0 var(--space-6)",
      font: "var(--fw-light) var(--fs-body-lg)/1.35 var(--font-sans)",
      color: "var(--text-on-dark)"
    }
  }, "de ter o controle total sobre o seu site, loja virtual, ag\xEAncia, rede social\u2026"), /*#__PURE__*/React.createElement(BulletList, {
    items: ["Atualize conteúdos de qualquer computador", "Insira fotos, vídeos, arquivos, músicas", "Confira os acessos, organize os usuários", "Relatórios completos sobre o tráfego", "Design personalizado à sua atividade", "Suporte e treinamento completos"]
  }), /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo-codemix-white.png",
    alt: "",
    style: {
      position: "absolute",
      right: "18px",
      bottom: "14px",
      height: "26px",
      opacity: .9,
      objectFit: "none",
      objectPosition: "right",
      width: "30px"
    }
  }))));
}
Object.assign(window, {
  HeroBand
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/codemix-web/HeroBand.jsx", error: String((e && e.message) || e) }); }

// ui_kits/codemix-web/HomeScreen.jsx
try { (() => {
const {
  SectionHeading,
  LinkArrow,
  Panel,
  MediaLinkList
} = window.CodemixDesignSystem_95bbea;
function ProductRow({
  logo,
  alt,
  title,
  children,
  last
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "196px 1fr",
      gap: "var(--space-6)",
      padding: "var(--space-7) 0",
      borderBottom: last ? "none" : "1px solid var(--border-subtle)"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("img", {
    src: logo,
    alt: alt,
    style: {
      width: "178px",
      display: "block"
    }
  }), /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "var(--space-4)",
      marginTop: "var(--space-5)",
      textDecoration: "none",
      font: "var(--type-body)",
      color: "var(--text-body)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: "15px",
      height: "15px",
      borderRadius: "var(--radius-pill)",
      background: "var(--grad-brand)",
      color: "#fff",
      font: "var(--fw-medium) 11px/15px var(--font-sans)",
      textAlign: "center"
    }
  }, "+"), "Saiba mais")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: "0 0 var(--space-4)",
      font: "var(--fw-regular) var(--fs-title-sm)/1.2 var(--font-sans)",
      color: "var(--text-heading)"
    }
  }, title), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      font: "var(--fw-regular) var(--fs-body-sm)/1.55 var(--font-sans)",
      color: "var(--text-body)"
    }
  }, children)));
}
function HomeScreen() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--container-max)",
      margin: "0 auto",
      padding: "var(--space-9) var(--container-gutter) var(--space-12)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 288px",
      gap: "var(--space-10)",
      alignItems: "start"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionHeading, {
    lead: "Assine j\xE1",
    size: "lg",
    sub: "Tudo \xE9 feito de forma virtual, n\xE3o sendo necess\xE1rio instalar nada!"
  }, "um dos nossos servi\xE7os e comece a utilizar os softwares agora!"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "var(--space-6) 0 var(--space-9)",
      font: "var(--fw-regular) var(--fs-body-lg)/1.5 var(--font-sans)"
    }
  }, "Temos a solu\xE7\xE3o ideal para a sua empresa. ", /*#__PURE__*/React.createElement(LinkArrow, null, "Consulte nossos planos")), /*#__PURE__*/React.createElement(Panel, {
    titleLead: "\xFAltimos",
    title: "lan\xE7amentos",
    subtitle: "softwares gerenciadores",
    padding: "var(--space-8)"
  }, /*#__PURE__*/React.createElement(ProductRow, {
    logo: "../../assets/produto-eagency.png",
    alt: "e:agency",
    title: "e:agency . design, publicidade e web."
  }, "Ag\xEAncias de cria\xE7\xE3o, tanto web quanto gr\xE1fica, que necessitam de um produto que gerencie o relacionamento com o atendente e os projetos que devem ser executados de maneira simples e f\xE1cil."), /*#__PURE__*/React.createElement(ProductRow, {
    logo: "../../assets/produto-eumobilien.png",
    alt: "eumobilien",
    title: "eumobilien . mapa de im\xF3veis na Europa",
    last: true
  }, "Com as portas e os olhos abertos para o mercado exterior, o sistema de im\xF3veis eumobilien pretende catalogar im\xF3veis na Europa e compartilhar com as Imobili\xE1rias e Corretores de Im\xF3veis Europeus."))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: "var(--space-8)"
    }
  }, /*#__PURE__*/React.createElement(AsidePitch, null), /*#__PURE__*/React.createElement(Panel, {
    titleLead: "cases",
    title: "de sucesso",
    subtitle: "clientes e resultados",
    padding: "var(--space-7)"
  }, /*#__PURE__*/React.createElement("h4", {
    style: {
      margin: "0 0 var(--space-4)",
      font: "var(--fw-regular) var(--fs-title-sm)/1.2 var(--font-sans)"
    }
  }, "UtJuris - rede social jur\xEDdica"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "0 0 var(--space-6)",
      font: "var(--fw-regular) var(--fs-body-sm)/1.5 var(--font-sans)"
    }
  }, "Rede social jur\xEDdica com \xEDndice do Direito brasileiro, v\xEDdeos e textos."), /*#__PURE__*/React.createElement("img", {
    src: "../../assets/case-utjuris-screen.png",
    alt: "UtJuris",
    style: {
      width: "100%",
      display: "block",
      border: "1px solid var(--border-subtle)",
      borderRadius: "var(--radius-sm)"
    }
  })), /*#__PURE__*/React.createElement(Panel, {
    titleLead: "layouts",
    title: "customiz\xE1veis",
    subtitle: "edite estilos",
    padding: "var(--space-4)"
  }, /*#__PURE__*/React.createElement(MediaLinkList, {
    items: [{
      label: "video",
      meta: "media player",
      kind: "video"
    }, {
      label: "apresentação",
      meta: "flash",
      kind: "flash"
    }, {
      label: "screenshot",
      meta: "telas",
      kind: "jpg"
    }]
  })))));
}
Object.assign(window, {
  HomeScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/codemix-web/HomeScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/codemix-web/ProductsScreen.jsx
try { (() => {
const {
  SectionHeading,
  LinkArrow,
  Panel,
  MediaLinkList
} = window.CodemixDesignSystem_95bbea;
function ProductsScreen() {
  const tutoriais = ["Gerenciamento de Clientes", "Gerenciamento de Processos", "Gerenciamento de Advogados", "Gerenciamento de Categorias", "Gerenciamento de Conteúdos", "Gerenciamento de Arquivos", "Gerenciamento de SEO"];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--container-max)",
      margin: "0 auto",
      padding: "var(--space-9) var(--container-gutter) var(--space-12)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 288px",
      gap: "var(--space-10)",
      alignItems: "start"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionHeading, {
    lead: "Conhe\xE7a",
    size: "lg",
    sub: "Encontre a solu\xE7\xE3o ideal para a sua empresa"
  }, "a nossa linha de gerenciadores de conte\xFAdo"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "var(--space-5) 0 var(--space-9)"
    }
  }, /*#__PURE__*/React.createElement(LinkArrow, null, "Consulte nossos planos")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "196px 1fr",
      gap: "var(--space-6)"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/produto-utjuris.png",
    alt: "UtJuris",
    style: {
      width: "176px",
      display: "block",
      border: "1px solid var(--border-subtle)",
      borderRadius: "var(--radius-sm)",
      background: "#fff"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "var(--space-5)",
      background: "linear-gradient(180deg,#f4f4f4 0%,#e4e4e4 100%)",
      border: "1px solid var(--border-subtle)",
      borderRadius: "var(--radius-md)",
      padding: "var(--space-3)"
    }
  }, /*#__PURE__*/React.createElement(MediaLinkList, {
    items: [{
      label: "video",
      meta: "media player",
      kind: "video"
    }, {
      label: "apresentação",
      meta: "flash",
      kind: "flash"
    }, {
      label: "screenshot",
      meta: "telas",
      kind: "jpg"
    }]
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: "0 0 var(--space-5)",
      font: "var(--fw-regular) var(--fs-title-sm)/1.2 var(--font-sans)"
    }
  }, "Rede Social Jur\xEDdica . UtJuris"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "0 0 var(--space-5)",
      font: "var(--fw-regular) var(--fs-body-sm)/1.55 var(--font-sans)"
    }
  }, "Rede social criada em novembro de 2008 com a inten\xE7\xE3o de unificar a informa\xE7\xE3o jur\xEDdica brasileira na internet, progressivamente todo o conte\xFAdo est\xE1 sendo inserido por n\xF3s e pelos usu\xE1rios que j\xE1 est\xE3o registrados."), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      font: "var(--fw-regular) var(--fs-body-sm)/1.55 var(--font-sans)"
    }
  }, "Voc\xEA encontra atualmente no UtJuris, \xE1udio, v\xEDdeo e textos sobre Direito, Legisla\xE7\xE3o, estamos construindo um index do Direito na internet pra facilitar a procura na internet de assunto relacionado, temos um sistema de busca espec\xEDfica do Direito, barra de ferramentas, informa\xE7\xF5es e not\xEDcias via RSS."))), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "var(--space-9) 0 0",
      font: "var(--fw-regular) var(--fs-body-sm)/1.55 var(--font-sans)"
    }
  }, "O cotidiano no trabalho dos profissionais do Direito mudou muito nos \xFAltimos anos, como por exemplo o acompanhamento processual e a peti\xE7\xE3o eletr\xF4nica e em breve outros avan\xE7os vir\xE3o, n\xE3o podendo o profissional da \xE1rea ficar desatualizado sob pena de perder espa\xE7o na atividade jur\xEDdica.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: "var(--space-8)"
    }
  }, /*#__PURE__*/React.createElement(AsidePitch, null), /*#__PURE__*/React.createElement(Panel, {
    titleLead: "Videos",
    title: "tutoriais",
    padding: "var(--space-6)"
  }, /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: "none",
      margin: 0,
      padding: 0,
      display: "grid",
      gap: "var(--space-5)"
    }
  }, tutoriais.map(t => /*#__PURE__*/React.createElement("li", {
    key: t
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      textDecoration: "none",
      color: "var(--text-body)",
      font: "var(--type-body)"
    }
  }, t))))), /*#__PURE__*/React.createElement(Panel, {
    titleLead: "Imagens",
    title: "software",
    padding: "var(--space-6)"
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      font: "var(--fw-regular) var(--fs-body-sm)/1.5 var(--font-sans)",
      color: "var(--text-muted)"
    }
  }, "Galeria de telas do gerenciador.")))));
}
Object.assign(window, {
  ProductsScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/codemix-web/ProductsScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/codemix-web/SiteChrome.jsx
try { (() => {
const {
  Logo,
  NavTabs,
  HighlightBar
} = window.CodemixDesignSystem_95bbea;
function SiteHeader({
  tab,
  onTab,
  subnav
}) {
  return /*#__PURE__*/React.createElement("header", {
    style: {
      background: "var(--grad-chrome)",
      position: "relative",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: "radial-gradient(120% 140% at 62% 10%,rgba(255,255,255,.06) 0%,rgba(255,255,255,0) 55%)",
      pointerEvents: "none"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--container-max)",
      margin: "0 auto",
      padding: "18px var(--container-gutter) 12px",
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement(Logo, {
    variant: "white",
    height: 54,
    assetBase: "../../",
    tagline: "Solu\xE7\xF5es em Sistemas de Informa\xE7\xE3o"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "right",
      font: "var(--fw-regular) var(--fs-body-sm)/1.6 var(--font-sans)",
      color: "var(--text-on-dark-muted)"
    }
  }, /*#__PURE__*/React.createElement("div", null, "ligue [ 41 ] 3022 8263"), /*#__PURE__*/React.createElement("div", null, "\u2709 info@codemix.com.br"))), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--container-max)",
      margin: "0 auto",
      padding: "0 var(--container-gutter)"
    }
  }, /*#__PURE__*/React.createElement(NavTabs, {
    items: ["home", "empresa", "produtos", "demonstrações", "suporte", "contato"],
    active: tab,
    onSelect: onTab,
    style: {
      background: "transparent",
      borderTop: "none"
    }
  })), /*#__PURE__*/React.createElement(HighlightBar, {
    right: "www.codemix.com.br"
  }, subnav));
}
Object.assign(window, {
  SiteHeader
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/codemix-web/SiteChrome.jsx", error: String((e && e.message) || e) }); }

__ds_ns.BulletList = __ds_scope.BulletList;

__ds_ns.MediaLinkList = __ds_scope.MediaLinkList;

__ds_ns.ProductThumb = __ds_scope.ProductThumb;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.LinkArrow = __ds_scope.LinkArrow;

__ds_ns.Logo = __ds_scope.Logo;

__ds_ns.SectionHeading = __ds_scope.SectionHeading;

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Divider = __ds_scope.Divider;

__ds_ns.Kbd = __ds_scope.Kbd;

__ds_ns.Stats = __ds_scope.Stats;

__ds_ns.Table = __ds_scope.Table;

__ds_ns.Alert = __ds_scope.Alert;

__ds_ns.Loading = __ds_scope.Loading;

__ds_ns.Progress = __ds_scope.Progress;

__ds_ns.Skeleton = __ds_scope.Skeleton;

__ds_ns.Toast = __ds_scope.Toast;

__ds_ns.Tooltip = __ds_scope.Tooltip;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Field = __ds_scope.Field;

__ds_ns.Fieldset = __ds_scope.Fieldset;

__ds_ns.FileInput = __ds_scope.FileInput;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Radio = __ds_scope.Radio;

__ds_ns.Range = __ds_scope.Range;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Textarea = __ds_scope.Textarea;

__ds_ns.Toggle = __ds_scope.Toggle;

__ds_ns.HighlightBar = __ds_scope.HighlightBar;

__ds_ns.NavTabs = __ds_scope.NavTabs;

__ds_ns.Panel = __ds_scope.Panel;

__ds_ns.Breadcrumbs = __ds_scope.Breadcrumbs;

__ds_ns.Pagination = __ds_scope.Pagination;

__ds_ns.Steps = __ds_scope.Steps;

__ds_ns.Tabs = __ds_scope.Tabs;

__ds_ns.Accordion = __ds_scope.Accordion;

__ds_ns.Dropdown = __ds_scope.Dropdown;

__ds_ns.Modal = __ds_scope.Modal;

})();
