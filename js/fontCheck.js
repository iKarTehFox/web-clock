function isFontAvailable(fontName) {
  return document.fonts.check(`12px "${fontName}"`);
}