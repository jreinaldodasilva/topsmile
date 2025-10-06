# Accessibility Checklist

## Before Release

### Automated Testing
- [x] Run jest-axe tests (`npm run test:a11y`)
- [ ] Run Lighthouse audit (`npm run lighthouse`)
- [ ] Check color contrast ratios
- [ ] Validate HTML
- [ ] Check heading hierarchy

### Keyboard Testing
- [x] Tab through entire application
- [x] Test all interactive elements
- [x] Verify focus indicators visible
- [x] Test keyboard shortcuts
- [x] Verify no keyboard traps
- [x] Test Escape key functionality

### Screen Reader Testing
- [ ] Test with NVDA (Windows)
- [ ] Test with JAWS (Windows)
- [ ] Test with VoiceOver (macOS/iOS)
- [ ] Test with TalkBack (Android)
- [ ] Verify all content announced
- [ ] Check form labels
- [ ] Verify error messages

### Visual Testing
- [ ] Test at 200% zoom
- [ ] Test with high contrast mode
- [ ] Verify color is not sole indicator
- [ ] Check touch target sizes (44x44px)
- [ ] Test with reduced motion
- [ ] Verify text spacing

### Content
- [ ] All images have alt text
- [ ] Videos have captions
- [ ] Audio has transcripts
- [ ] Links have descriptive text
- [ ] Headings are hierarchical
- [ ] Language attribute set

### Forms
- [x] All inputs have labels
- [x] Error messages associated
- [x] Required fields marked
- [x] Helper text provided
- [ ] Autocomplete attributes
- [ ] Field validation clear

### Components
- [x] Buttons have accessible names
- [x] Modals trap focus
- [x] Dropdowns keyboard navigable
- [x] Tables have proper markup
- [ ] Custom controls have ARIA
- [ ] Loading states announced

## WCAG 2.1 Compliance

### Level A (Required)
- [x] 1.1.1 Non-text Content
- [x] 1.2.1 Audio-only and Video-only
- [x] 1.3.1 Info and Relationships
- [x] 1.3.2 Meaningful Sequence
- [x] 1.3.3 Sensory Characteristics
- [x] 1.4.1 Use of Color
- [x] 2.1.1 Keyboard
- [x] 2.1.2 No Keyboard Trap
- [x] 2.1.4 Character Key Shortcuts
- [x] 2.4.1 Bypass Blocks
- [x] 2.4.2 Page Titled
- [x] 2.4.3 Focus Order
- [x] 2.4.4 Link Purpose
- [x] 3.1.1 Language of Page
- [x] 3.2.1 On Focus
- [x] 3.2.2 On Input
- [x] 3.3.1 Error Identification
- [x] 3.3.2 Labels or Instructions
- [x] 4.1.1 Parsing
- [x] 4.1.2 Name, Role, Value

### Level AA (Target)
- [x] 1.4.3 Contrast (Minimum)
- [x] 1.4.4 Resize Text
- [x] 1.4.5 Images of Text
- [x] 2.4.5 Multiple Ways
- [x] 2.4.6 Headings and Labels
- [x] 2.4.7 Focus Visible
- [x] 3.1.2 Language of Parts
- [x] 3.2.3 Consistent Navigation
- [x] 3.2.4 Consistent Identification
- [x] 3.3.3 Error Suggestion
- [x] 3.3.4 Error Prevention

## Tools

### Automated
- jest-axe
- Lighthouse
- axe DevTools
- WAVE
- HTML Validator

### Manual
- Keyboard only
- Screen readers
- Browser zoom
- High contrast mode
- Color blindness simulators

## Commands

```bash
# Run accessibility tests
npm run test:a11y

# Run Lighthouse audit
npm run lighthouse

# Run full audit
npm run audit:a11y
```

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM](https://webaim.org/)
- [A11y Project](https://www.a11yproject.com/)
