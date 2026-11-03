window.CR_DATA = {
  sports:[
    {id:'nfl',name:'NFL',full:'Pro Football',icon:'🏈',desc:'Sunday drama. Prime-time intensity.',mark:'NFL',featured:true},
    {id:'nba',name:'NBA',full:'Pro Basketball',icon:'🏀',desc:'The race to the rim and the ring.',mark:'NBA',featured:true},
    {id:'mlb',name:'MLB',full:'Baseball',icon:'⚾',desc:'Every pitch. Every pennant chase.',mark:'MLB',featured:true},
    {id:'nhl',name:'NHL',full:'Hockey',icon:'🏒',desc:'Fast ice. Heavy hits. Playoff heat.',mark:'NHL',featured:true},
    {id:'soccer',name:'Soccer',full:'Global Football',icon:'⚽',desc:'Club rivalries and international nights.',mark:'FC'},
    {id:'ncaaf',name:'College Football',full:'College Football',icon:'🎓',desc:'Tradition, rivalries, Saturdays.',mark:'CFB'},
    {id:'ncaab',name:'College Basketball',full:'College Basketball',icon:'🏆',desc:'Bracket busters and March madness.',mark:'CBB'},
    {id:'golf',name:'Golf',full:'Golf',icon:'⛳',desc:'Major championships and final-round pressure.',mark:'PGA'},
    {id:'tennis',name:'Tennis',full:'Tennis',icon:'🎾',desc:'Grand slams, rivalries, match points.',mark:'ATP'},
    {id:'motorsports',name:'Motorsports',full:'Motorsports',icon:'🏁',desc:'Race weekends, strategy, and speed.',mark:'RACE'},
    {id:'boxing',name:'Boxing',full:'Boxing',icon:'🥊',desc:'Fight nights and championship rounds.',mark:'KO'},
    {id:'wwe',name:'WWE',full:'Sports Entertainment',icon:'💥',desc:'Superstars, stories, and premium live events.',mark:'WWE'},
    {id:'aew',name:'AEW',full:'All Elite Wrestling',icon:'⚡',desc:'High-impact wrestling and big-match energy.',mark:'AEW'},
    {id:'ufc',name:'UFC',full:'Mixed Martial Arts',icon:'🥋',desc:'Fight cards, rankings, and octagon nights.',mark:'UFC'}
  ],
  games:[
    {id:'g1',sport:'nfl',league:'NFL',status:'LIVE',period:'Q3 · 08:42',away:'Kansas City',awayShort:'KC',awayScore:24,home:'San Francisco',homeShort:'SF',homeScore:20,detail:'Demo game · illustrative score',network:'CR SPORTS 1'},
    {id:'g2',sport:'nba',league:'NBA',status:'LIVE',period:'Q4 · 04:18',away:'Boston',awayShort:'BOS',awayScore:101,home:'New York',homeShort:'NYK',homeScore:98,detail:'Demo game · illustrative score',network:'CR SPORTS 2'},
    {id:'g3',sport:'mlb',league:'MLB',status:'FINAL',period:'Final',away:'Los Angeles',awayShort:'LAD',awayScore:5,home:'Chicago',homeShort:'CHC',homeScore:3,detail:'Demo game · illustrative score',network:'CR SPORTS EXTRA'},
    {id:'g4',sport:'nhl',league:'NHL',status:'UPCOMING',period:'Tonight · 7:30 PM',away:'Edmonton',awayShort:'EDM',awayScore:null,home:'Toronto',homeShort:'TOR',homeScore:null,detail:'Demo listing · local time illustrative',network:'CR SPORTS 3'},
    {id:'g5',sport:'soccer',league:'SOCCER',status:'LIVE',period:'2ND · 67:12',away:'Manchester City',awayShort:'MCI',awayScore:2,home:'Arsenal',homeShort:'ARS',homeScore:1,detail:'Demo match · illustrative score',network:'CR WORLD'},
    {id:'g6',sport:'ufc',league:'UFC',status:'UPCOMING',period:'Fight Night · Main Card',away:'Fighter A',awayShort:'A',awayScore:null,home:'Fighter B',homeShort:'B',homeScore:null,detail:'Fictional matchup for layout preview',network:'CR FIGHT NIGHT'},
    {id:'g7',sport:'wwe',league:'WWE',status:'UPCOMING',period:'Premium Live Event',away:'Team Red',awayShort:'RED',awayScore:null,home:'Team Blue',homeShort:'BLUE',homeScore:null,detail:'Fictional event card preview',network:'CR ARENA'},
    {id:'g8',sport:'aew',league:'AEW',status:'UPCOMING',period:'Dynamite · Preview',away:'The Elite',awayShort:'ELT',awayScore:null,home:'The Challengers',homeShort:'CHL',homeScore:null,detail:'Illustrative card placeholder',network:'CR ARENA'}
  ],
  stats:[
    {category:'NFL',name:'Jordan Hayes',team:'KC',metric:'Passing yards',value:'3,842'},
    {category:'NFL',name:'Marcus Reed',team:'SF',metric:'Rushing yards',value:'1,204'},
    {category:'NBA',name:'D. Mitchell',team:'NYK',metric:'Points per game',value:'31.2'},
    {category:'NBA',name:'J. Tatum',team:'BOS',metric:'Rebounds per game',value:'9.8'},
    {category:'MLB',name:'Alex Rivera',team:'LAD',metric:'Home runs',value:'42'},
    {category:'NHL',name:'E. Petrov',team:'TOR',metric:'Points',value:'87'}
  ],
  podcasts:[
    {title:'The Fourth Quarter',show:'CrowRules Sports Desk',category:'NFL · NBA',duration:'42 min',desc:'Big takes, late-game decisions, and the week’s defining moments.',art:'4Q'},
    {title:'Beyond the Baseline',show:'CrowRules Sports Desk',category:'ALL SPORTS',duration:'36 min',desc:'A wider look at the stories moving the sports world.',art:'BB'},
    {title:'Fight Night Breakdown',show:'CrowRules Fight Desk',category:'UFC · BOXING',duration:'28 min',desc:'Matchups, styles, and the details before the walkout.',art:'FN'},
    {title:'The Arena Report',show:'CrowRules Wrestling Desk',category:'WWE · AEW',duration:'31 min',desc:'Storylines, standout performances, and the road to the next event.',art:'AR'}
  ],
  picks:[
    {id:'p1',sport:'NFL',question:'Demo matchup: Kansas City vs. San Francisco',options:['Kansas City','San Francisco','Tie / no pick'],points:10},
    {id:'p2',sport:'NBA',question:'Demo matchup: Boston vs. New York',options:['Boston','New York','Tie / no pick'],points:10},
    {id:'p3',sport:'MLB',question:'Demo matchup: Los Angeles vs. Chicago',options:['Los Angeles','Chicago','Tie / no pick'],points:10},
    {id:'p4',sport:'UFC',question:'Fictional main event prediction',options:['Fighter A','Fighter B','Goes to decision'],points:15},
    {id:'p5',sport:'WWE / AEW',question:'Fantasy event bonus pick',options:['Championship changes','Title retained','Surprise return'],points:15}
  ],
  news:[
    {id:'n1',category:'NFL',label:'FILM ROOM',title:'The final eight minutes: where close games are won',deck:'A tactical breakdown of clock management, fourth-down choices, and late-game pressure.',read:'4 MIN READ',art:'08:42'},
    {id:'n2',category:'NBA',label:'COURTSIDE',title:'Spacing, pace, and the modern half-court attack',deck:'How movement away from the ball changes the geometry of an offense.',read:'6 MIN READ',art:'24'},
    {id:'n3',category:'UFC',label:'FIGHT DESK',title:'The matchup map: pressure versus distance',deck:'A fictional editorial preview format for breaking down styles before fight night.',read:'5 MIN READ',art:'ROUND 1'},
    {id:'n4',category:'WWE / AEW',label:'THE ARENA',title:'Building a rivalry that feels bigger than the bell',deck:'Story structure, momentum, and the moments that make a live crowd erupt.',read:'7 MIN READ',art:'MAIN EVENT'},
    {id:'n5',category:'SOCCER',label:'TACTICAL BOARD',title:'Press triggers: the pass that starts the chase',deck:'A coach’s-eye look at coordinated pressing and forcing play toward the touchline.',read:'5 MIN READ',art:'90:00'},
    {id:'n6',category:'ALL SPORTS',label:'NETWORK NOTEBOOK',title:'What makes a great sports moment last?',deck:'From the setting to the stakes, a look at how iconic moments are built.',read:'3 MIN READ',art:'CR'}
  ],
  tournaments:[{id:'t1',name:'CrowRules Championship Weekend',desc:'A demo bracket challenge built for special-event pick’em pools.',status:'OPEN',rounds:[{name:'Opening Round',matches:[['North Division','South Division'],['East Division','West Division']]},{name:'Final Four',matches:[['Winner Match 1','Winner Match 2']]},{name:'Championship',matches:[['Finalist A','Finalist B']]}]}]
};
