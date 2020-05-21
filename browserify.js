var lR = ALLEX.execSuite.libRegistry;
lR.register('allex_jqueryelementslib',require('./libindex')(
  ALLEX,
  lR.get('allex_applib'),
  lR.get('allex_applinkinglib'),
  lR.get('allex_templateslitelib'),
  lR.get('allex_htmltemplateslib'),
  lR.get('allex_formvalidationlib')
));
