var Initialize = function() {
	$(window).resize(function() {
		resizer();
	});
	$("#yessirer").scrollTop(scrollerBase);
	$("#efforter").click(function(e) {
		e.preventDefault();
		totalEffortClicks++;
		var whichFlags = ["grindstone", "back", "pain", "mile", "believe"];
		var howMuch = 1;
		for(var i = 0;i<whichFlags.length;i++) {
			howMuch += flags.flag(whichFlags[i]);
		}
		
		howMuch *= flags.flag("multiplier");

		incrementEffort(howMuch);
		
		/*
			PRETTY PRETTY ANIMATIONS, DAMMIT
		*/
		var obj = $("#effortclone").clone();
		obj.css("position", "absolute");
		obj.html("+" + howMuch);
		$("body").append(obj);
		var left = 15 * efforttoggle;
		efforttoggle *= -1;
		obj.css({"opacity": 1, "left": e.pageX, "top": e.pageY - 30});
		obj.animate({"opacity": 0, "top": (e.pageY - 60), "left": e.pageX - left}, 500, function() {
			$(this).remove();
		});
		Draw();
	});
	
	$("#efforter").mousedown(function(e) {
		$(this).stop().animate({boxShadow: '3px 3px 3px', top: 6}, "fast")
	});
	
	$("#efforter").mouseup(function(e) {
		$(this).stop().animate({boxShadow: '0px 9px 0px rgba(219,31,5,1)', top: 0}, "fast")
	});
	
	$("#paperworker").mousemove(function(e) {
		var howMuch = 1/20;
		totalPaperworkWiggles++;
		howMuch *= flags.flag("multiplier");
		incrementPaperwork(howMuch);
		/*
			PRETTY PRETTY ANIMATIONS, DAMMIT
		*/
		if(Math.random() < 0.10) {
			var obj = $("#effortclone").clone();
			obj.css("position", "absolute");
			obj.html("+" + howMuch);
			$("body").append(obj);
			var left = 15 * efforttoggle;
			efforttoggle *= -1;
			obj.css({"opacity": 1, "left": e.pageX, "top": e.pageY - 30});
			obj.animate({"opacity": 0, "top": (e.pageY - 60), "left": e.pageX - left}, 500, function() {
				$(this).remove();
			});
		}
		
		Draw();
	});
	
	$("#yessirer").scroll( function(e) {
		$(this).removeClass("neutral");
		var scrollerLoc = $(this).scrollTop();
		if(scrollStatus === "") {	//Status not yet set! SUCCESS, BITCHES
			incrementYessir(1);
			if (scrollerLoc < scrollerBase) {
				scrollStatus = "U";
				$(this).removeClass("down");
				$(this).addClass("up");
			}
			else {
				scrollStatus = "D";
				$(this).removeClass("up");
				$(this).addClass("down");
			}
		}
		else {
			var howMuch = 1;
			howMuch *= flags.flag("multiplier");
			if(scrollerLoc !== scrollerBase) {	//If current location is not equal to the base that it should always be reset to, THEEEEEENNNN...
				if(scrollerLoc < scrollerBase && scrollStatus === "D") {	//If location is "lower" (i.e. higher...it's weird) and the last status is down, then tally up and switch status to up!
					totalYessirScrolls++;
					incrementYessir(howMuch);
					scrollStatus = "U";
					$(this).removeClass("down");
					$(this).addClass("up");
				}
				else if(scrollerLoc > scrollerBase && scrollStatus === "U") {	//See comment above, but opposite it!...No, not the "Status not yet set" comment. Sheesh.
					totalYessirScrolls++;
					incrementYessir(howMuch);
					scrollStatus = "D";
					$(this).removeClass("up");
					$(this).addClass("down");
				}
			}
			Draw();
		}
		$(this).scrollTop(scrollerBase);
	});
	
	var x = y = 0; //$( "#buck" ).offset().left, y = $( "#buck" ).offset().top;
	$("#buck").draggable({ containment: "parent", stop: function() {
			var obj1 = {
				x:		$(this).offset().left,
				y:		$(this).offset().top,
				width:	$(this).width(),
				height:	$(this).height()
			};
			var obj2 = {
				x:		$("#goal").offset().left,
				y:		$("#goal").offset().top,
				width:	$("#goal").width(),
				height:	$("#goal").height()
			};

			if(obj1.x < obj2.x + obj2.width && obj1.x + obj1.width > obj2.x &&
				obj1.y < obj2.y + obj2.height && obj1.y + obj1.height > obj2.y) {
					var howMuch = 1;
					/*for(var i = 0;i<whichFlags.length;i++) {
						howMuch += flags.flag(whichFlags[i]);
					}
					
					howMuch *= flags.flag("multiplier");
					*/

					incrementBribery(howMuch);
					var newTop = $("#goal").offset().top + ($("#goal").height() / 2);
					var newLeft = $("#goal").offset().left + ($("#goal").width() / 2);
					//count++;
					$(this).animate({height: 0, width: 0}, 400, function() {
						$(this).animate({top: 0, left: 0, height: 50, width: 50}, 5);
					});
			}
			else {
				$(this).animate({top: 0, left: 0}, 500);
			}
		}
	});
	
	$("#save").click(function() {
		Save();
	});
	
	$("#reset").click(function() {
		if(confirm("Are you sure you want to reset?")) {
			Reset();
			Save();
			Load();
			updatePastGoals();
			updateCurrentGoals();
			twoCol();
		}
	});
	
	$("#export").click(function() {
		Save();
		Export();
	});
	
	$("#import").click(function() {
		Import();
	});
	
	Tutorial();
	
	tickerChange();
	setInterval(tickerChange, 1000*15);
	
	goals = [
		new Goal("Participation Award", {effort: 2, paperwork: 0, yessir: 0, bribery: 0}, function() {}),
		new Goal("Best Hand Turkey Drawer", {effort: 25, paperwork: 0, yessir: 0, bribery: 0}, function() {$("#effortdescribe").hide("slow");}),
		new Goal("Class Clown", {effort: 75, paperwork: 0, yessir: 0, bribery: 0}, function() {}),
		new Goal("Hall Monitor", {effort: 150, paperwork: 0, yessir: 0, bribery: 0}, function() {}),
		new Goal("Class Treasurer", {effort: 300, paperwork: 0, yessir: 0, bribery: 0}, function() {}),
		new Goal("Class Vice President", {effort: 600, paperwork: 0, yessir: 0, bribery: 0}, function() {}),
		new Goal("Class President", {effort: 1800, paperwork: 0, yessir: 0, bribery: 0}, function() {}),
		new Goal("Prom Royalty", {effort: 3600, paperwork: 0, yessir: 0, bribery: 0}, function() {}),
		new Goal("Sports Captain", {effort: 5800, paperwork: 0, yessir: 0, bribery: 0}, function() {threeCol();}),
		new Goal("Valedictorian", {effort: 10000, paperwork: 0, yessir: 0, bribery: 0}, function() {}),
		new Goal("Summa Cum Laude", {effort: 16100, paperwork: 0, yessir: 0, bribery: 0}, function() {}),
		new Goal("Fraternity Pledge", {effort: 23500, paperwork: 0, yessir: 0, bribery: 0}, function() {}),
		new Goal("Fraternity Treasurer", {effort: 32000, paperwork: 0, yessir: 0, bribery: 0}, function() {}),
		new Goal("Fraternity Vice President", {effort: 41300, paperwork: 0, yessir: 0, bribery: 0}, function() {}),
		new Goal("Fraternity President", {effort: 52000, paperwork: 0, yessir: 0, bribery: 0}, function() {}),
		new Goal("Inter-Fraternity Council President", {effort: 67200, paperwork: 0, yessir: 0, bribery: 0}, function() {}),
		new Goal("Big Man On Campus", {effort: 85000, paperwork: 0, yessir: 0, bribery: 0}, function() {}),
		new Goal("Fry Cook", {effort: 100000, paperwork: 1000, yessir: 0, bribery: 0}, function() {$("#paperworkdescribe").hide("slow");}),
		new Goal("Asst. Employee Of The Week", {effort: 128000, paperwork: 1280, yessir: 0, bribery: 0}, function() {}),
		new Goal("Employee Of The Week", {effort: 163840, paperwork: 1638.4, yessir: 0, bribery: 0}, function() {}),
		new Goal("Employee Of The Year", {effort: 209715.2, paperwork: 2097.152, yessir: 0, bribery: 0}, function() {}),
		new Goal("Assistant Assistant Manager", {effort: 268435.456, paperwork: 2684.35456, yessir: 0, bribery: 0}, function() {}),
		new Goal("Assistant Manager", {effort: 343597.38368, paperwork: 3435.9738368000003, yessir: 0, bribery: 0}, function() {}),
		new Goal("General Manager", {effort: 439804.65111040004, paperwork: 4398.046511104, yessir: 0, bribery: 0}, function() {}),
		new Goal("District Manager", {effort: 562949.953421312, paperwork: 5629.499534213121, yessir: 0, bribery: 0}, function() {}),
		new Goal("Teacher", {effort: 720575.9403792794, paperwork: 7205.759403792795, yessir: 0, bribery: 0}, function() {}),
		new Goal("Vice Principal", {effort: 922337.2036854777, paperwork: 9223.372036854777, yessir: 0, bribery: 0}, function() {}),
		new Goal("Principal", {effort: 1199038.364791121, paperwork: 11990.38364791121, yessir: 0, bribery: 0}, function() {}),
		new Goal("Professor", {effort: 1558749.8742284575, paperwork: 15587.498742284575, yessir: 0, bribery: 0}, function() {}),
		new Goal("Dean of Students", {effort: 2026374.8364969948, paperwork: 20263.74836496995, yessir: 0, bribery: 0}, function() {}),
		new Goal("PTA Treasurer", {effort: 2634287.2874460933, paperwork: 26342.872874460933, yessir: 0, bribery: 0}, function() {}),
		new Goal("PTA Vice President", {effort: 3424573.4736799216, paperwork: 34245.73473679922, yessir: 0, bribery: 0}, function() {}),
		new Goal("PTA President", {effort: 4451945.5157838985, paperwork: 44519.45515783899, yessir: 0, bribery: 0}, function() {}),
		new Goal("City Council", {effort: 5787529.170519068, paperwork: 57875.29170519068, yessir: 0, bribery: 0}, function() {}),
		new Goal("Undersheriff", {effort: 7523787.921674789, paperwork: 75237.87921674788, yessir: 0, bribery: 0}, function() {}),
		new Goal("Sheriff", {effort: 9780924.298177226, paperwork: 97809.24298177226, yessir: 0, bribery: 0}, function() {}),
		new Goal("Deputy Mayor", {effort: 12715201.587630393, paperwork: 127152.01587630394, yessir: 1271.5201587630393, bribery: 0}, function() {fourCol();}),
		new Goal("Mayor", {effort: 17165522.143301032, paperwork: 171655.22143301033, yessir: 1716.5522143301032, bribery: 0}, function() {$("#yessirdescribe").hide("slow");}),
		new Goal("Chupacabra", {effort: 23173454.893456396, paperwork: 231734.54893456397, yessir: 2317.3454893456396, bribery: 0}, function() {}),
		new Goal("Ruler of The Forests", {effort: 31284164.106166136, paperwork: 312841.64106166136, yessir: 3128.4164106166136, bribery: 0}, function() {}),
		new Goal("Judge", {effort: 42233621.543324284, paperwork: 422336.21543324285, yessir: 4223.362154332429, bribery: 0}, function() {}),
		new Goal("Lieutenant Governor", {effort: 57015389.08348779, paperwork: 570153.8908348778, yessir: 5701.538908348779, bribery: 0}, function() {}),
		new Goal("Governor", {effort: 76970775.26270851, paperwork: 769707.7526270852, yessir: 7697.077526270852, bribery: 0}, function() {}),
		new Goal("Senator", {effort: 103910546.6046565, paperwork: 1039105.466046565, yessir: 10391.05466046565, bribery: 0}, function() {}),
		new Goal("Vice President", {effort: 140279237.9162863, paperwork: 1402792.379162863, yessir: 14027.92379162863, bribery: 0}, function() {}),
		new Goal("President of the United States", {effort: 210418856.87442943, paperwork: 2104188.5687442943, yessir: 21041.885687442944, bribery: 0}, function() {}),
		new Goal("Nobel Peace Prize", {effort: 315628285.31164414, paperwork: 3156282.8531164415, yessir: 31562.828531164414, bribery: 0}, function() {}),
		new Goal("Head of United Nations", {effort: 473442427.96746624, paperwork: 4734424.279674662, yessir: 47344.24279674662, bribery: 0}, function() {}),
		new Goal("President of the Western Hemisphere", {effort: 710163641.9511993, paperwork: 7101636.4195119925, yessir: 71016.36419511992, bribery: 0}, function() {}),
		new Goal("President of Earth", {effort: 1065245462.9267989, paperwork: 10652454.629267989, yessir: 106524.5462926799, bribery: 1065.2454629267988}, function() {}),
		new Goal("The Greatest Human, Like, Ever", {effort: 1597868194.3901985, paperwork: 15978681.943901984, yessir: 159786.81943901983, bribery: 1597.8681943901984}, function() {}),
		new Goal("President of the Solar System", {effort: 3627160801.2657504, paperwork: 36271608.0126575, yessir: 362716.080126575, bribery: 3627.1608012657503}, function() {}),
		new Goal("President of the Solar Interstellar Neighborhood", {effort: 8233655018.873254, paperwork: 82336550.18873253, yessir: 823365.5018873253, bribery: 8233.655018873253}, function() {}),
		new Goal("President of the Milky Way Galaxy", {effort: 18690396892.842285, paperwork: 186903968.92842284, yessir: 1869039.6892842285, bribery: 18690.396892842284}, function() {}),
		new Goal("President of the Local Galactic Group", {effort: 42427200946.75199, paperwork: 424272009.46751994, yessir: 4242720.094675199, bribery: 42427.20094675199}, function() {}),
		new Goal("President of the Virgo Supercluster", {effort: 99703922224.86719, paperwork: 997039222.2486719, yessir: 9970392.22248672, bribery: 99703.9222248672}, function() {}),
		new Goal("President of all Local Superclusters", {effort: 234304217228.4379, paperwork: 2343042172.284379, yessir: 23430421.72284379, bribery: 234304.2172284379}, function() {}),
		new Goal("President of the Observable Universe", {effort: 550614910486.8291, paperwork: 5506149104.868291, yessir: 55061491.048682906, bribery: 550614.910486829}, function() {}),
		new Goal("President of Universe, Observable or Not", {effort: 1734436968033.5117, paperwork: 17344369680.335117, yessir: 173443696.80335116, bribery: 1734436.9680335117}, function() {}),
		new Goal("President of The Multiverse", {effort: 5463476449305.562, paperwork: 54634764493.05562, yessir: 546347644.9305562, bribery: 5463476.449305561}, function() {}),
		new Goal("President of Time", {effort: 17209950815312.518, paperwork: 172099508153.12518, yessir: 1720995081.531252, bribery: 17209950.81531252}, function() {}),
		new Goal("Vice God", {effort: 54211345068234.43, paperwork: 542113450682.3443, yessir: 5421134506.823443, bribery: 54211345.068234436}, function() {}),
		new Goal("God", {effort: 170765736964938.44, paperwork: 1707657369649.3843, yessir: 17076573696.493843, bribery: 170765736.96493843}, function() {}),
		new Goal("Ultra God", {effort: 537912071439556.06, paperwork: 5379120714395.561, yessir: 53791207143.955605, bribery: 537912071.439556}, function() {}),
		new Goal("The One", {effort: 1694423025034601.5, paperwork: 16944230250346.016, yessir: 169442302503.46014, bribery: 1694423025.0346014}, function() {}),
		new Goal("Pretty Good Incremental Game Developer", {effort: 5337432528858995, paperwork: 53374325288589.95, yessir: 533743252885.89954, bribery: 5337432528.858995}, function() {}),
		new Goal("Awesome Game Developer", {effort: 16812912465905834, paperwork: 168129124659058.34, yessir: 1681291246590.5835, bribery: 16812912465.905834}, function() {}),
		new Goal("Creator of GetElected!", {effort: 52960674267603376, paperwork: 529606742676033.75, yessir: 5296067426760.338, bribery: 52960674267.60338}, function() {}),
		new Goal("Nirvana", {effort: 166826123942950624, paperwork: 1668261239429506.2, yessir: 16682612394295.062, bribery: 166826123942.95062}, function() {}),
		new Goal("Reincarnate - True Vote Hunter Mode", {effort: 525502290420294460, paperwork: 5255022904202945, yessir: 52550229042029.45, bribery: 525502290420.29456}, function() {}),
		new Goal("TVHM Participation Award", {effort: 2000000000, paperwork: 20000000, yessir: 200000, bribery: 2000}, function() {}),
		new Goal("TVHM Best Hand Turkey Drawer", {effort: 25000000000, paperwork: 25000000000, yessir: 25000000000, bribery: 25000000000}, function() {}),
		new Goal("TVHM Class Clown", {effort: 75000000000, paperwork: 75000000000, yessir: 75000000000, bribery: 75000000000}, function() {}),
		new Goal("TVHM Hall Monitor", {effort: 150000000000, paperwork: 150000000000, yessir: 150000000000, bribery: 150000000000}, function() {}),
		new Goal("TVHM Class Treasurer", {effort: 300000000000, paperwork: 300000000000, yessir: 300000000000, bribery: 300000000000}, function() {}),
		new Goal("TVHM Class Vice President", {effort: 600000000000, paperwork: 600000000000, yessir: 600000000000, bribery: 600000000000}, function() {}),
		new Goal("TVHM Class President", {effort: 1800000000000, paperwork: 1800000000000, yessir: 1800000000000, bribery: 1800000000000}, function() {}),
		new Goal("TVHM Prom Royalty", {effort: 3600000000000, paperwork: 3600000000000, yessir: 3600000000000, bribery: 3600000000000}, function() {}),
		new Goal("TVHM Sports Captain", {effort: 5800000000000, paperwork: 5800000000000, yessir: 5800000000000, bribery: 5800000000000}, function() {}),
		new Goal("TVHM Valedictorian", {effort: 10000000000000, paperwork: 10000000000000, yessir: 10000000000000, bribery: 10000000000000}, function() {}),
		new Goal("TVHM Summa Cum Laude", {effort: 16100000000000, paperwork: 16100000000000, yessir: 16100000000000, bribery: 16100000000000}, function() {}),
		new Goal("TVHM Fraternity Pledge", {effort: 23500000000000, paperwork: 23500000000000, yessir: 23500000000000, bribery: 23500000000000}, function() {}),
		new Goal("TVHM Fraternity Treasurer", {effort: 32000000000000, paperwork: 32000000000000, yessir: 32000000000000, bribery: 32000000000000}, function() {}),
		new Goal("TVHM Fraternity Vice President", {effort: 41300000000000, paperwork: 41300000000000, yessir: 41300000000000, bribery: 41300000000000}, function() {}),
		new Goal("TVHM Fraternity President", {effort: 52000000000000, paperwork: 52000000000000, yessir: 52000000000000, bribery: 52000000000000}, function() {}),
		new Goal("TVHM Inter-Fraternity Council President", {effort: 67200000000000, paperwork: 67200000000000, yessir: 67200000000000, bribery: 67200000000000}, function() {}),
		new Goal("TVHM Big Man On Campus", {effort: 85000000000000, paperwork: 85000000000000, yessir: 85000000000000, bribery: 85000000000000}, function() {}),
		new Goal("TVHM Fry Cook", {effort: 100000000000000, paperwork: 100000000000000, yessir: 100000000000000, bribery: 100000000000000}, function() {}),
		new Goal("TVHM Asst. Employee Of The Week", {effort: 128000000000000, paperwork: 128000000000000, yessir: 128000000000000, bribery: 128000000000000}, function() {}),
		new Goal("TVHM Employee Of The Week", {effort: 163840000000000, paperwork: 163840000000000, yessir: 163840000000000, bribery: 163840000000000}, function() {}),
		new Goal("TVHM Employee Of The Year", {effort: 209715200000000, paperwork: 209715200000000, yessir: 209715200000000, bribery: 209715200000000}, function() {}),
		new Goal("TVHM Assistant Assistant Manager", {effort: 268435456000000, paperwork: 268435456000000, yessir: 268435456000000, bribery: 268435456000000}, function() {}),
		new Goal("TVHM Assistant Manager", {effort: 343597383680000, paperwork: 343597383680000, yessir: 343597383680000, bribery: 343597383680000}, function() {}),
		new Goal("TVHM General Manager", {effort: 439804651110400.06, paperwork: 439804651110400.06, yessir: 439804651110400.06, bribery: 439804651110400.06}, function() {}),
		new Goal("TVHM District Manager", {effort: 562949953421312, paperwork: 562949953421312, yessir: 562949953421312, bribery: 562949953421312}, function() {}),
		new Goal("TVHM Teacher", {effort: 720575940379279.4, paperwork: 720575940379279.4, yessir: 720575940379279.4, bribery: 720575940379279.4}, function() {}),
		new Goal("TVHM Vice Principal", {effort: 922337203685477.8, paperwork: 922337203685477.8, yessir: 922337203685477.8, bribery: 922337203685477.8}, function() {}),
		new Goal("TVHM Principal", {effort: 1199038364791121, paperwork: 1199038364791121, yessir: 1199038364791121, bribery: 1199038364791121}, function() {}),
		new Goal("TVHM Professor", {effort: 1558749874228457.5, paperwork: 1558749874228457.5, yessir: 1558749874228457.5, bribery: 1558749874228457.5}, function() {}),
		new Goal("TVHM Dean of Students", {effort: 2026374836496994.8, paperwork: 2026374836496994.8, yessir: 2026374836496994.8, bribery: 2026374836496994.8}, function() {}),
		new Goal("TVHM PTA Treasurer", {effort: 2634287287446093.5, paperwork: 2634287287446093.5, yessir: 2634287287446093.5, bribery: 2634287287446093.5}, function() {}),
		new Goal("TVHM PTA Vice President", {effort: 3424573473679921.5, paperwork: 3424573473679921.5, yessir: 3424573473679921.5, bribery: 3424573473679921.5}, function() {}),
		new Goal("TVHM PTA President", {effort: 4451945515783898.5, paperwork: 4451945515783898.5, yessir: 4451945515783898.5, bribery: 4451945515783898.5}, function() {}),
		new Goal("TVHM City Council", {effort: 5787529170519068, paperwork: 5787529170519068, yessir: 5787529170519068, bribery: 5787529170519068}, function() {}),
		new Goal("TVHM Undersheriff", {effort: 7523787921674789, paperwork: 7523787921674789, yessir: 7523787921674789, bribery: 7523787921674789}, function() {}),
		new Goal("TVHM Sheriff", {effort: 9780924298177226, paperwork: 9780924298177226, yessir: 9780924298177226, bribery: 9780924298177226}, function() {}),
		new Goal("TVHM Deputy Mayor", {effort: 12715201587630392, paperwork: 12715201587630392, yessir: 12715201587630392, bribery: 12715201587630392}, function() {}),
		new Goal("TVHM Mayor", {effort: 17165522143301032, paperwork: 17165522143301032, yessir: 17165522143301032, bribery: 17165522143301032}, function() {}),
		new Goal("TVHM Chupacabra", {effort: 23173454893456396, paperwork: 23173454893456396, yessir: 23173454893456396, bribery: 23173454893456396}, function() {}),
		new Goal("TVHM Ruler of The Forests", {effort: 31284164106166136, paperwork: 31284164106166136, yessir: 31284164106166136, bribery: 31284164106166136}, function() {}),
		new Goal("TVHM Judge", {effort: 42233621543324288, paperwork: 42233621543324288, yessir: 42233621543324288, bribery: 42233621543324288}, function() {}),
		new Goal("TVHM Lieutenant Governor", {effort: 57015389083487784, paperwork: 57015389083487784, yessir: 57015389083487784, bribery: 57015389083487784}, function() {}),
		new Goal("TVHM Governor", {effort: 76970775262708512, paperwork: 76970775262708512, yessir: 76970775262708512, bribery: 76970775262708512}, function() {}),
		new Goal("TVHM Senator", {effort: 103910546604656496, paperwork: 103910546604656496, yessir: 103910546604656496, bribery: 103910546604656496}, function() {}),
		new Goal("TVHM Vice President", {effort: 140279237916286288, paperwork: 140279237916286288, yessir: 140279237916286288, bribery: 140279237916286288}, function() {}),
		new Goal("TVHM President of the United States", {effort: 210418856874429440, paperwork: 210418856874429440, yessir: 210418856874429440, bribery: 210418856874429440}, function() {}),
		new Goal("TVHM Nobel Peace Prize", {effort: 315628285311644160, paperwork: 315628285311644160, yessir: 315628285311644160, bribery: 315628285311644160}, function() {}),
		new Goal("TVHM Head of United Nations", {effort: 473442427967466240, paperwork: 473442427967466240, yessir: 473442427967466240, bribery: 473442427967466240}, function() {}),
		new Goal("TVHM President of the Western Hemisphere", {effort: 710163641951199230, paperwork: 710163641951199230, yessir: 710163641951199230, bribery: 710163641951199230}, function() {}),
		new Goal("TVHM President of Earth", {effort: 1065245462926798980, paperwork: 1065245462926798980, yessir: 1065245462926798980, bribery: 1065245462926798980}, function() {}),
		new Goal("TVHM The Greatest Human, Like, Ever", {effort: 1597868194390198530, paperwork: 1597868194390198530, yessir: 1597868194390198530, bribery: 1597868194390198530}, function() {}),
		new Goal("TVHM President of the Solar System", {effort: 3627160801265750500, paperwork: 3627160801265750500, yessir: 3627160801265750500, bribery: 3627160801265750500}, function() {}),
		new Goal("TVHM President of the Solar Interstellar Neighborhood", {effort: 8233655018873253900, paperwork: 8233655018873253900, yessir: 8233655018873253900, bribery: 8233655018873253900}, function() {}),
		new Goal("TVHM President of the Milky Way Galaxy", {effort: 18690396892842287000, paperwork: 18690396892842287000, yessir: 18690396892842287000, bribery: 18690396892842287000}, function() {}),
		new Goal("TVHM President of the Local Galactic Group", {effort: 42427200946751990000, paperwork: 42427200946751990000, yessir: 42427200946751990000, bribery: 42427200946751990000}, function() {}),
		new Goal("TVHM President of the Virgo Supercluster", {effort: 99703922224867180000, paperwork: 99703922224867180000, yessir: 99703922224867180000, bribery: 99703922224867180000}, function() {}),
		new Goal("TVHM President of all Local Superclusters", {effort: 234304217228437880000, paperwork: 234304217228437880000, yessir: 234304217228437880000, bribery: 234304217228437880000}, function() {}),
		new Goal("TVHM President of the Observable Universe", {effort: 550614910486829100000, paperwork: 550614910486829100000, yessir: 550614910486829100000, bribery: 550614910486829100000}, function() {}),
		new Goal("TVHM President of Universe, Observable or Not", {effort: 1734436968033511800000, paperwork: 1734436968033511800000, yessir: 1734436968033511800000, bribery: 1734436968033511800000}, function() {}),
		new Goal("TVHM President of The Multiverse", {effort: 5463476449305561000000, paperwork: 5463476449305561000000, yessir: 5463476449305561000000, bribery: 5463476449305561000000}, function() {}),
		new Goal("TVHM President of Time", {effort: 17209950815312518000000, paperwork: 17209950815312518000000, yessir: 17209950815312518000000, bribery: 17209950815312518000000}, function() {}),
		new Goal("TVHM Vice God", {effort: 54211345068234430000000, paperwork: 54211345068234430000000, yessir: 54211345068234430000000, bribery: 54211345068234430000000}, function() {}),
		new Goal("TVHM God", {effort: 170765736964938440000000, paperwork: 170765736964938440000000, yessir: 170765736964938440000000, bribery: 170765736964938440000000}, function() {}),
		new Goal("TVHM Ultra God", {effort: 537912071439556060000000, paperwork: 537912071439556060000000, yessir: 537912071439556060000000, bribery: 537912071439556060000000}, function() {}),
		new Goal("TVHM The One", {effort: 1694423025034601500000000, paperwork: 1694423025034601500000000, yessir: 1694423025034601500000000, bribery: 1694423025034601500000000}, function() {}),
		new Goal("TVHM Pretty Good Incremental Game Developer", {effort: 5337432528858995000000000, paperwork: 5337432528858995000000000, yessir: 5337432528858995000000000, bribery: 5337432528858995000000000}, function() {}),
		new Goal("TVHM Awesome Game Developer", {effort: 16812912465905833000000000, paperwork: 16812912465905833000000000, yessir: 16812912465905833000000000, bribery: 16812912465905833000000000}, function() {}),
		new Goal("TVHM Creator of GetElected!", {effort: 52960674267603370000000000, paperwork: 52960674267603370000000000, yessir: 52960674267603370000000000, bribery: 52960674267603370000000000}, function() {}),
		new Goal("TVHM Nirvana", {effort: 166826123942950620000000000, paperwork: 166826123942950620000000000, yessir: 166826123942950620000000000, bribery: 166826123942950620000000000}, function() {}),
		new Goal("Kill Screen", {effort: 166826123942950600000000000000, paperwork: 166826123942950600000000000000, yessir: 166826123942950600000000000000, bribery: 166826123942950600000000000000}, function() {})
	];
	
	//Below code used to stress test.
	/*
	var ids = [];
	for(var i = 0;i<200;i++) {
		var myID = randString(8);
		addPowerUp(myID, {effort: 1, paperwork: 0, yessir: 0}, "Stuff", "Stuff", "effortPowerUp", function(num) {
			return {
				"effort": 1*num,
				"paperwork": 0*num,
				"yessir": 0*num
			}
		}, false);
		ids[ids.length] = myID;
	}*/
	
	addPowerUp("stranger", {effort: 15, paperwork: 0, yessir: 0}, "Stranger", function() { return "+" + (0.1 + flags.flag("perfectstrangers") + flags.flag("perfectstrangers2")) + " Effort Per Second";}, "effortPrimary", function(num) {return {"effort": (0.1 + flags.flag("perfectstrangers") + flags.flag("perfectstrangers2")) * num,"paperwork": 0,"yessir": 0};}, false);
	addPowerUp("acquaintance", {effort: 100, paperwork: 0, yessir: 0}, "Acquaintance", function() { return "+" + (0.5 + flags.flag("gettingtoknowyou") + flags.flag("gettingtoknowallaboutyou")) + " Effort Per Second";}, "effortPrimary", function(num) {return {"effort": (0.5 + flags.flag("gettingtoknowyou") + flags.flag("gettingtoknowallaboutyou")) * num,"paperwork": 0,"yessir": 0};}, false);
	addPowerUp("friend", {effort: 900, paperwork: 0, yessir: 0}, "Friend", function() { return "+" + (3 + flags.flag("joey") + flags.flag("chandler")) + " Effort Per Second";}, "effortPrimary", function(num) {return {"effort": (3 + flags.flag("joey") + flags.flag("chandler")) * num,"paperwork": 0,"yessir": 0};}, false);
	addPowerUp("bro", {effort: 25437, paperwork: 0, yessir: 0}, "Bro", function() { return "+" + (50 + flags.flag("budlight") + flags.flag("collar")) + " Effort Per Second";}, "effortPrimary", function(num) {return {"effort": (50 + flags.flag("budlight") + flags.flag("collar")) * num,"paperwork": 0,"yessir": 0};}, false);
	addPowerUp("bestfriend", {effort: 150000, paperwork: 5000, yessir: 0}, "Best Friend", function() { return "+" + (300 + flags.flag("pizza") + flags.flag("hideabody")) + " Effort Per Second";}, "effortPrimary", function(num) {return {"effort": (300 + flags.flag("pizza") + flags.flag("hideabody")) * num,"paperwork": 0,"yessir": 0};}, false);
	addPowerUp("bff", {effort: 314159, paperwork: 133700, yessir: 0}, "BFF", function() { return "+" + (2400 + flags.flag("idkmbffj") + flags.flag("instantgram")) + " Effort Per Second";}, "effortPrimary", function(num) {return {"effort": (2400 + flags.flag("idkmbffj") + flags.flag("instantgram")) * num,"paperwork": 0,"yessir": 0};}, false);
	addPowerUp("personallawyer", {effort: 1000000, paperwork: 675000, yessir: 10000}, "Personal Lawyer", function() { return "+" + (9999 + flags.flag("objection") + flags.flag("takethat")) + " Effort Per Second";}, "effortPrimary", function(num) {return {"effort": (9999 + flags.flag("objection") + flags.flag("takethat")) * num,"paperwork": 0,"yessir": 0};}, false);
	addPowerUp("sigother", {effort: 11235813, paperwork: 3333360, yessir: 270000}, "Significant Other", function() { return "+" + (70000 + flags.flag("cohabitate") + flags.flag("cosign")) + " Effort Per Second";}, "effortPrimary", function(num) {return {"effort": (70000 + flags.flag("cohabitate") + flags.flag("cosign")) * num,"paperwork": 0,"yessir": 0};}, false);
	addPowerUp("superpac", {effort: 81000000, paperwork: 7598950, yessir: 999000}, "Super PAC", function() { return "+" + (500000 + flags.flag("babypac") + flags.flag("mspac")) + " Effort Per Second";}, "effortPrimary", function(num) {return {"effort": (500000 + flags.flag("babypac") + flags.flag("mspac")) * num,"paperwork": 0,"yessir": 0};}, false);
	addPowerUp("staples", {effort: 0, paperwork: 15, yessir: 0}, "Staples", function() { return "+" + (0.1 + flags.flag("paperclips") + flags.flag("paperbinders")) + " Paperwork Per Second";}, "paperworkPrimary", function(num) {return {"effort": 0,"paperwork": (0.1 + flags.flag("paperclips") + flags.flag("paperbinders")) * num,"yessir": 0};}, false)
	addPowerUp("pencil", {effort: 0, paperwork: 100, yessir: 0}, "Pencil", function() { return "+" + (0.5 + flags.flag("sharpenedPencil") + flags.flag("mechanicalpencil")) + " Paperwork Per Second";}, "paperworkPrimary", function(num) {return {"effort": 0,"paperwork": (0.5 + flags.flag("sharpenedPencil") + flags.flag("mechanicalpencil")) * num,"yessir": 0};}, false)
	addPowerUp("pen", {effort: 0, paperwork: 900, yessir: 0}, "Pen", function() { return "+" + (3 + flags.flag("moreink") + flags.flag("cyberpen")) + " Paperwork Per Second";}, "paperworkPrimary", function(num) {return {"effort": 0,"paperwork": (3 + flags.flag("moreink") + flags.flag("cyberpen")) * num,"yessir": 0};}, false)
	addPowerUp("typewriter", {effort: 0, paperwork: 25437, yessir: 0}, "Typewriter", function() { return "+" + (50 + flags.flag("wordprocessor") + flags.flag("talktotext")) + " Paperwork Per Second";}, "paperworkPrimary", function(num) {return {"effort": 0,"paperwork": (50 + flags.flag("wordprocessor") + flags.flag("talktotext")) * num,"yessir": 0};}, false)
	addPowerUp("printer", {effort: 540000, paperwork: 150000, yessir: 0}, "Printer", function() { return "+" + (300 + flags.flag("laserprinter") + flags.flag("threeinone")) + " Paperwork Per Second";}, "paperworkPrimary", function(num) {return {"effort": 0,"paperwork": (300 + flags.flag("laserprinter") + flags.flag("threeinone")) * num,"yessir": 0};}, false)
	addPowerUp("altavista", {effort: 4850000, paperwork: 314159, yessir: 0}, "Email Address", function() { return "+" + (2400 + flags.flag("lycos") + flags.flag("compuserve")) + " Paperwork Per Second";}, "paperworkPrimary", function(num) {return {"effort": 0,"paperwork": (2400 + flags.flag("lycos") + flags.flag("compuserve")) * num,"yessir": 0};}, false)
	addPowerUp("orphans", {effort: 25600000, paperwork: 1000000, yessir: 80000}, "Flock of orphans with your handwriting", function() { return "+" + (9999 + flags.flag("gruel") + flags.flag("posters")) + " Paperwork Per Second";}, "paperworkPrimary", function(num) {return {"effort": 0,"paperwork": (9999 + flags.flag("gruel") + flags.flag("posters")) * num,"yessir": 0};}, false)
	addPowerUp("robots", {effort: 101200000, paperwork: 11235813, yessir: 670000}, "Robots. God damned robots.", function() { return "+" + (70000 + flags.flag("laserguns") + flags.flag("sentience")) + " Paperwork Per Second";}, "paperworkPrimary", function(num) {return {"effort": 0,"paperwork": (70000 + flags.flag("laserguns") + flags.flag("sentience")) * num,"yessir": 0};}, false)
	addPowerUp("unicron", {effort: 155848000, paperwork: 81000000, yessir: 1599000}, "Living planet with amazing handwriting", function() { return "+" + (500000 + flags.flag("matrix") + flags.flag("disc")) + " Paperwork Per Second";}, "paperworkPrimary", function(num) {return {"effort": 0,"paperwork": (500000 + flags.flag("matrix") + flags.flag("disc")) * num,"yessir": 0};}, false)
	addPowerUp("tippiecanoe", {effort: 0, paperwork: 0, yessir: 15}, "\"Tippecanoe and Tyler Too!\"", function() { return "+" + (0.1 + flags.flag("tyler") + flags.flag("harrison")) + " Yes Sir Per Second";}, "yessirPrimary", function(num) {return {"effort": 0,"paperwork": 0,"yessir": (0.1 + flags.flag("tyler") + flags.flag("harrison")) * num};}, false)
	addPowerUp("harry", {effort: 0, paperwork: 0, yessir: 100}, "\"Give 'Em Hell, Harry!\"", function() { return "+" + (0.5 + flags.flag("barkley") + flags.flag("truman")) + " Yes Sir Per Second";}, "yessirPrimary", function(num) {return {"effort": 0,"paperwork": 0,"yessir": (0.5 + flags.flag("barkley") + flags.flag("truman")) * num};}, false)
	addPowerUp("ike", {effort: 0, paperwork: 0, yessir: 900}, "\"I Like Ike!\"", function() { return "+" + (3 + flags.flag("nixon") + flags.flag("eisenhower")) + " Yes Sir Per Second";}, "yessirPrimary", function(num) {return {"effort": 0,"paperwork": 0,"yessir": (3 + flags.flag("nixon") + flags.flag("eisenhower")) * num};}, false)
	addPowerUp("great", {effort: 0, paperwork: 0, yessir: 25437}, "\"A Time For Greatness\"", function() { return "+" + (50 + flags.flag("johnson") + flags.flag("kennedy")) + " Yes Sir Per Second";}, "yessirPrimary", function(num) {return {"effort": 0,"paperwork": 0,"yessir": (50 + flags.flag("johnson") + flags.flag("kennedy")) * num};}, false)
	addPowerUp("taxes", {effort: 9110000, paperwork: 647000, yessir: 150000}, "\"No New Taxes\"", function() { return "+" + (300 + flags.flag("quayle") + flags.flag("bush")) + " Yes Sir Per Second";}, "yessirPrimary", function(num) {return {"effort": 0,"paperwork": 0,"yessir": (300 + flags.flag("quayle") + flags.flag("bush")) * num};}, false)
	addPowerUp("timeforchange", {effort: 44400000, paperwork: 1234567, yessir: 314159}, "\"It's Time To Change America\"", function() { return "+" + (2400 + flags.flag("gore") + flags.flag("clinton")) + " Yes Sir Per Second";}, "yessirPrimary", function(num) {return {"effort": 0,"paperwork": 0,"yessir": (2400 + flags.flag("gore") + flags.flag("clinton")) * num};}, false)
	addPowerUp("change", {effort: 322222222, paperwork: 12345678, yessir: 1000000}, "\"Change\"", function() { return "+" + (9999 + flags.flag("biden") + flags.flag("obama")) + " Yes Sir Per Second";}, "yessirPrimary", function(num) {return {"effort": 0,"paperwork": 0,"yessir": (9999 + flags.flag("biden") + flags.flag("obama")) * num};}, false)
	addPowerUp("handsacrossamerica", {effort: 5000000000, paperwork: 123456789, yessir: 11235813}, "\"Free Sexual Favors For Everyone!\"", function() { return "+" + (70000 + flags.flag("morelube") + flags.flag("chickenmeanscock")) + " Yes Sir Per Second";}, "yessirPrimary", function(num) {return {"effort": 0,"paperwork": 0,"yessir": (70000 + flags.flag("morelube") + flags.flag("chickenmeanscock")) * num};}, false)
	addPowerUp("morelies", {effort: 8500000000, paperwork: 370370367, yessir: 134829756}, "\"Here, Have Some Empty Promises\"", function() { return "+" + (500000 + flags.flag("jobs") + flags.flag("hungryhungry")) + " Yes Sir Per Second";}, "yessirPrimary", function(num) {return {"effort": 0,"paperwork": 0,"yessir": (500000 + flags.flag("jobs") + flags.flag("hungryhungry")) * num};}, false)
	addPowerUp("perfectstrangers", {effort: 500, paperwork: 0, yessir: 0}, "Perfect Strangers", function() { return "+2 Effort For Every Stranger";}, "effortSecondary", function(num) { if( $("#perfectstrangers").length > 0 && num > 0) {$("#perfectstrangers").remove();}flags.flag("perfectstrangers", 2); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("perfectstrangers", 0);});
	addPowerUp("perfectstrangers2", {effort: 45000, paperwork: 0, yessir: 0}, "Perfect Strangers Mk. II", function() { return "+50 Effort For Every Stranger";}, "effortSecondary", function(num) { if( $("#perfectstrangers2").length > 0 && num > 0) {$("#perfectstrangers2").remove();}flags.flag("perfectstrangers2", 50); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("perfectstrangers2", 0);});
	addPowerUp("gettingtoknowyou", {effort: 7600, paperwork: 0, yessir: 0}, "Getting To Know You", function() { return "+5 Effort For Every Acquaintance";}, "effortSecondary", function(num) { if( $("#gettingtoknowyou").length > 0 && num > 0) {$("#gettingtoknowyou").remove();}flags.flag("gettingtoknowyou", 5); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("gettingtoknowyou", 0);});
	addPowerUp("gettingtoknowallaboutyou", {effort: 98000, paperwork: 0, yessir: 0}, "Getting To Know All About You", function() { return "+70 Effort For Every Acquaintance";}, "effortSecondary", function(num) { if( $("#gettingtoknowallaboutyou").length > 0 && num > 0) {$("#gettingtoknowallaboutyou").remove();}flags.flag("gettingtoknowallaboutyou", 70); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("gettingtoknowallaboutyou", 0);});
	addPowerUp("joey", {effort: 50000, paperwork: 0, yessir: 0}, "Joey", function() { return "+10 Effort For Every Friend";}, "effortSecondary", function(num) { if( $("#joey").length > 0 && num > 0) {$("#joey").remove();}flags.flag("joey", 10); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("joey", 0);});
	addPowerUp("chandler", {effort: 222000, paperwork: 0, yessir: 0}, "Chandler", function() { return "+115 Effort For Every Friend";}, "effortSecondary", function(num) { if( $("#chandler").length > 0 && num > 0) {$("#chandler").remove();}flags.flag("chandler", 115); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("chandler", 0);});
	addPowerUp("budlight", {effort: 920000, paperwork: 0, yessir: 0}, "Bud Light", function() { return "+115 Effort For Every Bro";}, "effortSecondary", function(num) { if( $("#budlight").length > 0 && num > 0) {$("#budlight").remove();}flags.flag("budlight", 115); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("budlight", 0);});
	addPowerUp("collar", {effort: 3200000, paperwork: 0, yessir: 0}, "Popped Collar", function() { return "+420 Effort For Every Bro";}, "effortSecondary", function(num) { if( $("#collar").length > 0 && num > 0) {$("#collar").remove();}flags.flag("collar", 420); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("collar", 0);});
	addPowerUp("pizza", {effort: 720000, paperwork: 42000, yessir: 0}, "Pizza", function() { return "+500 Effort For Every Best Friend";}, "effortSecondary", function(num) { if( $("#pizza").length > 0 && num > 0) {$("#pizza").remove();}flags.flag("pizza", 500); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("pizza", 0);});
	addPowerUp("hideabody", {effort: 3200000, paperwork: 118000, yessir: 0}, "Hide A Body Maybe?", function() { return "+900 Effort For Every Best Friend";}, "effortSecondary", function(num) { if( $("#hideabody").length > 0 && num > 0) {$("#hideabody").remove();}flags.flag("hideabody", 900); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("hideabody", 0);});
	addPowerUp("idkmbffj", {effort: 1120000, paperwork: 77777, yessir: 0}, "IDK, my BFF Jill?", function() { return "+1234 Effort For Every BFF";}, "effortSecondary", function(num) { if( $("#idkmbffj").length > 0 && num > 0) {$("#idkmbffj").remove();}flags.flag("idkmbffj", 1234); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("idkmbffj", 0);});
	addPowerUp("instantgram", {effort: 9876543, paperwork: 300000, yessir: 0}, "Instant Gram (That's What The Kids Call It?)", function() { return "+5000 Effort For Every BFF";}, "effortSecondary", function(num) { if( $("#instantgram").length > 0 && num > 0) {$("#instantgram").remove();}flags.flag("instantgram", 5000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("instantgram", 0);});
	addPowerUp("objection", {effort: 4810000, paperwork: 1475000, yessir: 49000}, "OBJECTION!", function() { return "+25000 Effort For Every Personal Lawyer";}, "effortSecondary", function(num) { if( $("#objection").length > 0 && num > 0) {$("#objection").remove();}flags.flag("objection", 25000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("objection", 0);});
	addPowerUp("takethat", {effort: 10240000, paperwork: 6675000, yessir: 260000}, "TAKE THAT!!", function() { return "+50000 Effort For Every Personal Lawyer";}, "effortSecondary", function(num) { if( $("#takethat").length > 0 && num > 0) {$("#takethat").remove();}flags.flag("takethat", 50000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("takethat", 0);});
	addPowerUp("cohabitate", {effort: 21345589, paperwork: 9999990, yessir: 679000}, "Move In Together", function() { return "+150000 Effort For Every Significant Other";}, "effortSecondary", function(num) { if( $("#cohabitate").length > 0 && num > 0) {$("#cohabitate").remove();}flags.flag("cohabitate", 150000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("cohabitate", 0);});
	addPowerUp("cosign", {effort: 144233377, paperwork: 50000000, yessir: 4110000}, "Buy A House!", function() { return "+300000 Effort For Every Significant Other";}, "effortSecondary", function(num) { if( $("#cosign").length > 0 && num > 0) {$("#cosign").remove();}flags.flag("cosign", 300000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("cosign", 0);});
	addPowerUp("babypac", {effort: 231777551, paperwork: 32000000, yessir: 1241100}, "Baby PAC", function() { return "+1750000 Effort For Every Super PAC";}, "effortSecondary", function(num) { if( $("#babypac").length > 0 && num > 0) {$("#babypac").remove();}flags.flag("babypac", 1750000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("babypac", 0);});
	addPowerUp("mspac", {effort: 1557773120, paperwork: 68800000, yessir: 9000000}, "Ms. PAC", function() { return "+5000000 Effort For Every Super PAC";}, "effortSecondary", function(num) { if( $("#mspac").length > 0 && num > 0) {$("#mspac").remove();}flags.flag("mspac", 5000000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("mspac", 0);});
	addPowerUp("paperclips", {effort: 0, paperwork: 500, yessir: 0}, "Paperclips", function() { return "+2 Paperwork For Every Staples";}, "paperworkSecondary", function(num) { if( $("#paperclips").length > 0 && num > 0) {$("#paperclips").remove();}flags.flag("paperclips", 2); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("paperclips", 0);});
	addPowerUp("paperbinders", {effort: 0, paperwork: 45000, yessir: 0}, "Paper Binders", function() { return "+50 Paperwork For Every Staples";}, "paperworkSecondary", function(num) { if( $("#paperbinders").length > 0 && num > 0) {$("#paperbinders").remove();}flags.flag("paperbinders", 50); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("paperbinders", 0);});
	addPowerUp("sharpenedPencil", {effort: 0, paperwork: 7600, yessir: 0}, "Sharpened Pencil", function() { return "+5 Paperwork For Every Pencil";}, "paperworkSecondary", function(num) { if( $("#sharpenedPencil").length > 0 && num > 0) {$("#sharpenedPencil").remove();}flags.flag("sharpenedPencil", 5); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("sharpenedPencil", 0);});
	addPowerUp("mechanicalpencil", {effort: 0, paperwork: 98000, yessir: 0}, "Mechanical Pencil", function() { return "+70 Paperwork For Every Pencil";}, "paperworkSecondary", function(num) { if( $("#mechanicalpencil").length > 0 && num > 0) {$("#mechanicalpencil").remove();}flags.flag("mechanicalpencil", 70); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("mechanicalpencil", 0);});
	addPowerUp("moreink", {effort: 0, paperwork: 50000, yessir: 0}, "MORE. INK.", function() { return "+10 Paperwork For Every Pen";}, "paperworkSecondary", function(num) { if( $("#moreink").length > 0 && num > 0) {$("#moreink").remove();}flags.flag("moreink", 10); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("moreink", 0);});
	addPowerUp("cyberpen", {effort: 0, paperwork: 222000, yessir: 0}, "Cybernetic Pen", function() { return "+115 Paperwork For Every Pen";}, "paperworkSecondary", function(num) { if( $("#cyberpen").length > 0 && num > 0) {$("#cyberpen").remove();}flags.flag("cyberpen", 115); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("cyberpen", 0);});
	addPowerUp("wordprocessor", {effort: 0, paperwork: 920000, yessir: 0}, "Word Processor", function() { return "+115 Paperwork For Every Typewriter";}, "paperworkSecondary", function(num) { if( $("#wordprocessor").length > 0 && num > 0) {$("#wordprocessor").remove();}flags.flag("wordprocessor", 115); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("wordprocessor", 0);});
	addPowerUp("talktotext", {effort: 0, paperwork: 3200000, yessir: 0}, "Talk To Text", function() { return "+420 Paperwork For Every Typewriter";}, "paperworkSecondary", function(num) { if( $("#talktotext").length > 0 && num > 0) {$("#talktotext").remove();}flags.flag("talktotext", 420); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("talktotext", 0);});
	addPowerUp("laserprinter", {effort: 3110000, paperwork: 720000, yessir: 0}, "Laser Printer", function() { return "+500 Paperwork For Every Printer";}, "paperworkSecondary", function(num) { if( $("#laserprinter").length > 0 && num > 0) {$("#laserprinter").remove();}flags.flag("laserprinter", 500); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("laserprinter", 0);});
	addPowerUp("threeinone", {effort: 8240000, paperwork: 3200000, yessir: 0}, "Three In One Printer", function() { return "+900 Paperwork For Every Printer";}, "paperworkSecondary", function(num) { if( $("#threeinone").length > 0 && num > 0) {$("#threeinone").remove();}flags.flag("threeinone", 900); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("threeinone", 0);});
	addPowerUp("lycos", {effort: 5120000, paperwork: 1120000, yessir: 0}, "Lycos", function() { return "+1234 Paperwork For Every Email Address";}, "paperworkSecondary", function(num) { if( $("#lycos").length > 0 && num > 0) {$("#lycos").remove();}flags.flag("lycos", 1234); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("lycos", 0);});
	addPowerUp("compuserve", {effort: 42420000, paperwork: 9876543, yessir: 0}, "CompuServe", function() { return "+5000 Paperwork For Every Email Address";}, "paperworkSecondary", function(num) { if( $("#compuserve").length > 0 && num > 0) {$("#compuserve").remove();}flags.flag("compuserve", 5000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("compuserve", 0);});
	addPowerUp("gruel", {effort: 16140000, paperwork: 4810000, yessir: 721000}, "Bowls Of Gruel", function() { return "+25000 Paperwork For Every Flock of orphans with your handwriting";}, "paperworkSecondary", function(num) { if( $("#gruel").length > 0 && num > 0) {$("#gruel").remove();}flags.flag("gruel", 25000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("gruel", 0);});
	addPowerUp("posters", {effort: 616100000, paperwork: 10240000, yessir: 3210000}, "Motivational Posters!", function() { return "+50000 Paperwork For Every Flock of orphans with your handwriting";}, "paperworkSecondary", function(num) { if( $("#posters").length > 0 && num > 0) {$("#posters").remove();}flags.flag("posters", 50000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("posters", 0);});
	addPowerUp("laserguns", {effort: 397110000, paperwork: 21345589, yessir: 679000}, "Laser Guns", function() { return "+150000 Paperwork For Every Robots. God damned robots.";}, "paperworkSecondary", function(num) { if( $("#laserguns").length > 0 && num > 0) {$("#laserguns").remove();}flags.flag("laserguns", 150000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("laserguns", 0);});
	addPowerUp("sentience", {effort: 1337000000, paperwork: 144233377, yessir: 4110000}, "Sentience", function() { return "+300000 Paperwork For Every Robots. God damned robots.";}, "paperworkSecondary", function(num) { if( $("#sentience").length > 0 && num > 0) {$("#sentience").remove();}flags.flag("sentience", 300000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("sentience", 0);});
	addPowerUp("matrix", {effort: 794220000, paperwork: 64036767, yessir: 2716000}, "Matrix of...Eh.", function() { return "+1750000 Paperwork For Every Living planet with amazing handwriting";}, "paperworkSecondary", function(num) { if( $("#matrix").length > 0 && num > 0) {$("#matrix").remove();}flags.flag("matrix", 1750000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("matrix", 0);});
	addPowerUp("disc", {effort: 1588440000, paperwork: 177407054, yessir: 5432000}, "Silver Disc", function() { return "+5000000 Paperwork For Every Living planet with amazing handwriting";}, "paperworkSecondary", function(num) { if( $("#disc").length > 0 && num > 0) {$("#disc").remove();}flags.flag("disc", 5000000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("disc", 0);});
	addPowerUp("tyler", {effort: 0, paperwork: 0, yessir: 500}, "John Tyler", function() { return "+2 Yes Sir For Every \"Tippecanoe and Tyler Too!\"";}, "yessirSecondary", function(num) { if( $("#tyler").length > 0 && num > 0) {$("#tyler").remove();}flags.flag("tyler", 2); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("tyler", 0);});
	addPowerUp("harrison", {effort: 0, paperwork: 0, yessir: 45000}, "William Henry Harrison", function() { return "+50 Yes Sir For Every \"Tippecanoe and Tyler Too!\"";}, "yessirSecondary", function(num) { if( $("#harrison").length > 0 && num > 0) {$("#harrison").remove();}flags.flag("harrison", 50); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("harrison", 0);});
	addPowerUp("barkley", {effort: 0, paperwork: 0, yessir: 7600}, "Alben W. Barkley", function() { return "+5 Yes Sir For Every \"Give 'Em Hell, Harry!\"";}, "yessirSecondary", function(num) { if( $("#barkley").length > 0 && num > 0) {$("#barkley").remove();}flags.flag("barkley", 5); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("barkley", 0);});
	addPowerUp("truman", {effort: 0, paperwork: 0, yessir: 98000}, "Harry S. Truman", function() { return "+70 Yes Sir For Every \"Give 'Em Hell, Harry!\"";}, "yessirSecondary", function(num) { if( $("#truman").length > 0 && num > 0) {$("#truman").remove();}flags.flag("truman", 70); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("truman", 0);});
	addPowerUp("nixon", {effort: 0, paperwork: 0, yessir: 50000}, "Richard Nixon", function() { return "+10 Yes Sir For Every \"I Like Ike!\"";}, "yessirSecondary", function(num) { if( $("#nixon").length > 0 && num > 0) {$("#nixon").remove();}flags.flag("nixon", 10); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("nixon", 0);});
	addPowerUp("eisenhower", {effort: 0, paperwork: 0, yessir: 222000}, "Dwight D. Eisenhower", function() { return "+115 Yes Sir For Every \"I Like Ike!\"";}, "yessirSecondary", function(num) { if( $("#eisenhower").length > 0 && num > 0) {$("#eisenhower").remove();}flags.flag("eisenhower", 115); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("eisenhower", 0);});
	addPowerUp("johnson", {effort: 0, paperwork: 0, yessir: 920000}, "Lyndon B. Johnson", function() { return "+115 Yes Sir For Every \"A Time For Greatness\"";}, "yessirSecondary", function(num) { if( $("#johnson").length > 0 && num > 0) {$("#johnson").remove();}flags.flag("johnson", 115); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("johnson", 0);});
	addPowerUp("kennedy", {effort: 0, paperwork: 0, yessir: 3200000}, "John F. Kennedy", function() { return "+420 Yes Sir For Every \"A Time For Greatness\"";}, "yessirSecondary", function(num) { if( $("#kennedy").length > 0 && num > 0) {$("#kennedy").remove();}flags.flag("kennedy", 420); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("kennedy", 0);});
	addPowerUp("quayle", {effort: 18660000, paperwork: 18660000, yessir: 18660000}, "Dan Quayle", function() { return "+500 Yes Sir For Every \"No New Taxes\"";}, "yessirSecondary", function(num) { if( $("#quayle").length > 0 && num > 0) {$("#quayle").remove();}flags.flag("quayle", 500); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("quayle", 0);});
	addPowerUp("bush", {effort: 49440000, paperwork: 49440000, yessir: 49440000}, "George H. W. Bush", function() { return "+900 Yes Sir For Every \"No New Taxes\"";}, "yessirSecondary", function(num) { if( $("#bush").length > 0 && num > 0) {$("#bush").remove();}flags.flag("bush", 900); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("bush", 0);});
	addPowerUp("gore", {effort: 30720000, paperwork: 30720000, yessir: 30720000}, "Al Gore", function() { return "+1234 Yes Sir For Every \"It's Time To Change America\"";}, "yessirSecondary", function(num) { if( $("#gore").length > 0 && num > 0) {$("#gore").remove();}flags.flag("gore", 1234); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("gore", 0);});
	addPowerUp("clinton", {effort: 254520000, paperwork: 254520000, yessir: 254520000}, "Bill Clinton", function() { return "+5000 Yes Sir For Every \"It's Time To Change America\"";}, "yessirSecondary", function(num) { if( $("#clinton").length > 0 && num > 0) {$("#clinton").remove();}flags.flag("clinton", 5000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("clinton", 0);});
	addPowerUp("biden", {effort: 96840000, paperwork: 96840000, yessir: 96840000}, "Joe Biden", function() { return "+25000 Yes Sir For Every \"Change\"";}, "yessirSecondary", function(num) { if( $("#biden").length > 0 && num > 0) {$("#biden").remove();}flags.flag("biden", 25000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("biden", 0);});
	addPowerUp("obama", {effort: 3696600000, paperwork: 3696600000, yessir: 3696600000}, "Barack Obama", function() { return "+50000 Yes Sir For Every \"Change\"";}, "yessirSecondary", function(num) { if( $("#obama").length > 0 && num > 0) {$("#obama").remove();}flags.flag("obama", 50000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("obama", 0);});
	addPowerUp("morelube", {effort: 2382660000, paperwork: 2382660000, yessir: 2382660000}, "More Lube", function() { return "+150000 Yes Sir For Every \"Free Sexual Favors For Everyone!\"";}, "yessirSecondary", function(num) { if( $("#morelube").length > 0 && num > 0) {$("#morelube").remove();}flags.flag("morelube", 150000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("morelube", 0);});
	addPowerUp("chickenmeanscock", {effort: 8022000000, paperwork: 8022000000, yessir: 8022000000}, "A \"Chicken\" In Every \"Pot\"", function() { return "+300000 Yes Sir For Every \"Free Sexual Favors For Everyone!\"";}, "yessirSecondary", function(num) { if( $("#chickenmeanscock").length > 0 && num > 0) {$("#chickenmeanscock").remove();}flags.flag("chickenmeanscock", 300000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("chickenmeanscock", 0);});
	addPowerUp("jobs", {effort: 4765320000, paperwork: 4765320000, yessir: 4765320000}, "\"Jobs For Everyone, For Real!\"", function() { return "+1750000 Yes Sir For Every \"Here, Have Some Empty Promises\"";}, "yessirSecondary", function(num) { if( $("#jobs").length > 0 && num > 0) {$("#jobs").remove();}flags.flag("jobs", 1750000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("jobs", 0);});
	addPowerUp("hungryhungry", {effort: 9530640000, paperwork: 9530640000, yessir: 9530640000}, "\"I Will End World Hunger Forever.\"", function() { return "+5000000 Yes Sir For Every \"Here, Have Some Empty Promises\"";}, "yessirSecondary", function(num) { if( $("#hungryhungry").length > 0 && num > 0) {$("#hungryhungry").remove();}flags.flag("hungryhungry", 5000000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("hungryhungry", 0);});
	addPowerUp("grindstone", {effort: 1100, paperwork: 0, yessir: 0}, "Nose To The Grindstone", function() {return "+5 Effort For Every Click";}, "effortTertiary", function(num) { if( $("#grindstone").length > 0 && num > 0) {$("#grindstone").remove();} flags.flag("grindstone", 5); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("grindstone", 0);});
	addPowerUp("back", {effort: 21000, paperwork: 0, yessir: 0}, "Put Your Back Into It", function() {return "+75 Effort For Every Click";}, "effortTertiary", function(num) { if( $("#back").length > 0 && num > 0) {$("#back").remove();} flags.flag("back", 75); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("back", 0);});
	addPowerUp("pain", {effort: 480000, paperwork: 0, yessir: 0}, "No Pain, No Gain", function() {return "+500 Effort For Every Click";}, "effortTertiary", function(num) { if( $("#pain").length > 0 && num > 0) {$("#pain").remove();} flags.flag("pain", 500); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("pain", 0);});
	addPowerUp("mile", {effort: 3456000, paperwork: 0, yessir: 0}, "Go The Extra Mile", function() {return "+2500 Effort For Every Click";}, "effortTertiary", function(num) { if( $("#mile").length > 0 && num > 0) {$("#mile").remove();} flags.flag("mile", 2500); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("mile", 0);});
	addPowerUp("believe", {effort: 9999990, paperwork: 0, yessir: 0}, "Believe In Yourself", function() {return "+30000 Effort For Every Click";}, "effortTertiary", function(num) { if( $("#believe").length > 0 && num > 0) {$("#believe").remove();} flags.flag("believe", 30000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("believe", 0);});
	
	/*
	addPowerUp("stranger", {effort: 15, paperwork: 0, yessir: 0}, "Stranger", function() { return "+" + (0.1 + flags.flag("perfectstrangers") + flags.flag("perfectstrangers2")) + " Effort Per Second";}, "effortPrimary", function(num) {return {"effort": (0.1 + flags.flag("perfectstrangers") + flags.flag("perfectstrangers2")) * num,"paperwork": 0,"yessir": 0};}, false);
	addPowerUp("acquaintance", {effort: 100, paperwork: 0, yessir: 0}, "Acquaintance", function() { return "+" + (0.5 + flags.flag("gettingtoknowyou") + flags.flag("gettingtoknowallaboutyou")) + " Effort Per Second";}, "effortPrimary", function(num) {return {"effort": (0.5 + flags.flag("gettingtoknowyou") + flags.flag("gettingtoknowallaboutyou")) * num,"paperwork": 0,"yessir": 0};}, false);
	addPowerUp("friend", {effort: 900, paperwork: 0, yessir: 0}, "Friend", function() { return "+" + (3 + flags.flag("joey") + flags.flag("chandler")) + " Effort Per Second";}, "effortPrimary", function(num) {return {"effort": (3 + flags.flag("joey") + flags.flag("chandler")) * num,"paperwork": 0,"yessir": 0};}, false);
	addPowerUp("bro", {effort: 25437, paperwork: 0, yessir: 0}, "Bro", function() { return "+" + (50 + flags.flag("budlight") + flags.flag("collar")) + " Effort Per Second";}, "effortPrimary", function(num) {return {"effort": (50 + flags.flag("budlight") + flags.flag("collar")) * num,"paperwork": 0,"yessir": 0};}, false);
	addPowerUp("bestfriend", {effort: 150000, paperwork: 5000, yessir: 0}, "Best Friend", function() { return "+" + (300 + flags.flag("pizza") + flags.flag("hideabody")) + " Effort Per Second";}, "effortPrimary", function(num) {return {"effort": (300 + flags.flag("pizza") + flags.flag("hideabody")) * num,"paperwork": 0,"yessir": 0};}, false);
	addPowerUp("bff", {effort: 314159, paperwork: 133700, yessir: 0}, "BFF", function() { return "+" + (2400 + flags.flag("idkmbffj") + flags.flag("instantgram")) + " Effort Per Second";}, "effortPrimary", function(num) {return {"effort": (2400 + flags.flag("idkmbffj") + flags.flag("instantgram")) * num,"paperwork": 0,"yessir": 0};}, false);
	addPowerUp("personallawyer", {effort: 1000000, paperwork: 675000, yessir: 10000}, "Personal Lawyer", function() { return "+" + (9999 + flags.flag("objection") + flags.flag("takethat")) + " Effort Per Second";}, "effortPrimary", function(num) {return {"effort": (9999 + flags.flag("objection") + flags.flag("takethat")) * num,"paperwork": 0,"yessir": 0};}, false);
	addPowerUp("sigother", {effort: 11235813, paperwork: 3333360, yessir: 270000}, "Significant Other", function() { return "+" + (70000 + flags.flag("cohabitate") + flags.flag("cosign")) + " Effort Per Second";}, "effortPrimary", function(num) {return {"effort": (70000 + flags.flag("cohabitate") + flags.flag("cosign")) * num,"paperwork": 0,"yessir": 0};}, false);
	addPowerUp("superpac", {effort: 81000000, paperwork: 7598950, yessir: 999000}, "Super PAC", function() { return "+" + (500000 + flags.flag("babypac") + flags.flag("mspac")) + " Effort Per Second";}, "effortPrimary", function(num) {return {"effort": (500000 + flags.flag("babypac") + flags.flag("mspac")) * num,"paperwork": 0,"yessir": 0};}, false);
	addPowerUp("staples", {effort: 0, paperwork: 15, yessir: 0}, "Staples", function() { return "+" + (0.1 + flags.flag("paperclips") + flags.flag("paperbinders")) + " Paperwork Per Second";}, "paperworkPrimary", function(num) {return {"effort": 0,"paperwork": (0.1 + flags.flag("paperclips") + flags.flag("paperbinders")) * num,"yessir": 0};}, false)
	addPowerUp("pencil", {effort: 0, paperwork: 100, yessir: 0}, "Pencil", function() { return "+" + (0.5 + flags.flag("sharpenedPencil") + flags.flag("mechanicalpencil")) + " Paperwork Per Second";}, "paperworkPrimary", function(num) {return {"effort": 0,"paperwork": (0.5 + flags.flag("sharpenedPencil") + flags.flag("mechanicalpencil")) * num,"yessir": 0};}, false)
	addPowerUp("pen", {effort: 0, paperwork: 900, yessir: 0}, "Pen", function() { return "+" + (3 + flags.flag("moreink") + flags.flag("cyberpen")) + " Paperwork Per Second";}, "paperworkPrimary", function(num) {return {"effort": 0,"paperwork": (3 + flags.flag("moreink") + flags.flag("cyberpen")) * num,"yessir": 0};}, false)
	addPowerUp("typewriter", {effort: 0, paperwork: 25437, yessir: 0}, "Typewriter", function() { return "+" + (50 + flags.flag("wordprocessor") + flags.flag("talktotext")) + " Paperwork Per Second";}, "paperworkPrimary", function(num) {return {"effort": 0,"paperwork": (50 + flags.flag("wordprocessor") + flags.flag("talktotext")) * num,"yessir": 0};}, false)
	addPowerUp("printer", {effort: 540000, paperwork: 150000, yessir: 0}, "Printer", function() { return "+" + (300 + flags.flag("laserprinter") + flags.flag("threeinone")) + " Paperwork Per Second";}, "paperworkPrimary", function(num) {return {"effort": 0,"paperwork": (300 + flags.flag("laserprinter") + flags.flag("threeinone")) * num,"yessir": 0};}, false)
	addPowerUp("altavista", {effort: 4850000, paperwork: 314159, yessir: 0}, "Email Address", function() { return "+" + (2400 + flags.flag("lycos") + flags.flag("compuserve")) + " Paperwork Per Second";}, "paperworkPrimary", function(num) {return {"effort": 0,"paperwork": (2400 + flags.flag("lycos") + flags.flag("compuserve")) * num,"yessir": 0};}, false)
	addPowerUp("orphans", {effort: 25600000, paperwork: 1000000, yessir: 80000}, "Flock of orphans with your handwriting", function() { return "+" + (9999 + flags.flag("gruel") + flags.flag("posters")) + " Paperwork Per Second";}, "paperworkPrimary", function(num) {return {"effort": 0,"paperwork": (9999 + flags.flag("gruel") + flags.flag("posters")) * num,"yessir": 0};}, false)
	addPowerUp("robots", {effort: 101200000, paperwork: 11235813, yessir: 670000}, "Robots. God damned robots.", function() { return "+" + (70000 + flags.flag("laserguns") + flags.flag("sentience")) + " Paperwork Per Second";}, "paperworkPrimary", function(num) {return {"effort": 0,"paperwork": (70000 + flags.flag("laserguns") + flags.flag("sentience")) * num,"yessir": 0};}, false)
	addPowerUp("unicron", {effort: 155848000, paperwork: 81000000, yessir: 1599000}, "Living planet with amazing handwriting", function() { return "+" + (500000 + flags.flag("matrix") + flags.flag("disc")) + " Paperwork Per Second";}, "paperworkPrimary", function(num) {return {"effort": 0,"paperwork": (500000 + flags.flag("matrix") + flags.flag("disc")) * num,"yessir": 0};}, false)
	addPowerUp("tippiecanoe", {effort: 0, paperwork: 0, yessir: 15}, "\"Tippecanoe and Tyler Too!\"", function() { return "+" + (0.1 + flags.flag("tyler") + flags.flag("harrison")) + " Yes Sir Per Second";}, "yessirPrimary", function(num) {return {"effort": 0,"paperwork": 0,"yessir": (0.1 + flags.flag("tyler") + flags.flag("harrison")) * num};}, false)
	addPowerUp("harry", {effort: 0, paperwork: 0, yessir: 100}, "\"Give 'Em Hell, Harry!\"", function() { return "+" + (0.5 + flags.flag("barkley") + flags.flag("truman")) + " Yes Sir Per Second";}, "yessirPrimary", function(num) {return {"effort": 0,"paperwork": 0,"yessir": (0.5 + flags.flag("barkley") + flags.flag("truman")) * num};}, false)
	addPowerUp("ike", {effort: 0, paperwork: 0, yessir: 900}, "\"I Like Ike!\"", function() { return "+" + (3 + flags.flag("nixon") + flags.flag("eisenhower")) + " Yes Sir Per Second";}, "yessirPrimary", function(num) {return {"effort": 0,"paperwork": 0,"yessir": (3 + flags.flag("nixon") + flags.flag("eisenhower")) * num};}, false)
	addPowerUp("great", {effort: 0, paperwork: 0, yessir: 25437}, "\"A Time For Greatness\"", function() { return "+" + (50 + flags.flag("johnson") + flags.flag("kennedy")) + " Yes Sir Per Second";}, "yessirPrimary", function(num) {return {"effort": 0,"paperwork": 0,"yessir": (50 + flags.flag("johnson") + flags.flag("kennedy")) * num};}, false)
	addPowerUp("taxes", {effort: 9110000, paperwork: 647000, yessir: 150000}, "\"No New Taxes\"", function() { return "+" + (300 + flags.flag("quayle") + flags.flag("bush")) + " Yes Sir Per Second";}, "yessirPrimary", function(num) {return {"effort": 0,"paperwork": 0,"yessir": (300 + flags.flag("quayle") + flags.flag("bush")) * num};}, false)
	addPowerUp("timeforchange", {effort: 44400000, paperwork: 1234567, yessir: 314159}, "\"It's Time To Change America\"", function() { return "+" + (2400 + flags.flag("gore") + flags.flag("clinton")) + " Yes Sir Per Second";}, "yessirPrimary", function(num) {return {"effort": 0,"paperwork": 0,"yessir": (2400 + flags.flag("gore") + flags.flag("clinton")) * num};}, false)
	addPowerUp("change", {effort: 322222222, paperwork: 12345678, yessir: 1000000}, "\"Change\"", function() { return "+" + (9999 + flags.flag("biden") + flags.flag("obama")) + " Yes Sir Per Second";}, "yessirPrimary", function(num) {return {"effort": 0,"paperwork": 0,"yessir": (9999 + flags.flag("biden") + flags.flag("obama")) * num};}, false)
	addPowerUp("handsacrossamerica", {effort: 5000000000, paperwork: 123456789, yessir: 11235813}, "\"Free Sexual Favors For Everyone!\"", function() { return "+" + (70000 + flags.flag("morelube") + flags.flag("chickenmeanscock")) + " Yes Sir Per Second";}, "yessirPrimary", function(num) {return {"effort": 0,"paperwork": 0,"yessir": (70000 + flags.flag("morelube") + flags.flag("chickenmeanscock")) * num};}, false)
	addPowerUp("morelies", {effort: 8500000000, paperwork: 370370367, yessir: 134829756}, "\"Here, Have Some Empty Promises\"", function() { return "+" + (500000 + flags.flag("jobs") + flags.flag("hungryhungry")) + " Yes Sir Per Second";}, "yessirPrimary", function(num) {return {"effort": 0,"paperwork": 0,"yessir": (500000 + flags.flag("jobs") + flags.flag("hungryhungry")) * num};}, false)
	addPowerUp("perfectstrangers", {effort: 500, paperwork: 0, yessir: 0}, "Perfect Strangers", function() { return "+2 Effort For Every Stranger";}, "effortSecondary", function(num) { if( $("#perfectstrangers").length > 0 && num > 0) {$("#perfectstrangers").remove();}flags.flag("perfectstrangers", 2); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("perfectstrangers", 0);});
	addPowerUp("perfectstrangers2", {effort: 45000, paperwork: 0, yessir: 0}, "Perfect Strangers Mk. II", function() { return "+50 Effort For Every Stranger";}, "effortSecondary", function(num) { if( $("#perfectstrangers2").length > 0 && num > 0) {$("#perfectstrangers2").remove();}flags.flag("perfectstrangers2", 50); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("perfectstrangers2", 0);});
	addPowerUp("gettingtoknowyou", {effort: 7600, paperwork: 0, yessir: 0}, "Getting To Know You", function() { return "+5 Effort For Every Acquaintance";}, "effortSecondary", function(num) { if( $("#gettingtoknowyou").length > 0 && num > 0) {$("#gettingtoknowyou").remove();}flags.flag("gettingtoknowyou", 5); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("gettingtoknowyou", 0);});
	addPowerUp("gettingtoknowallaboutyou", {effort: 620000, paperwork: 0, yessir: 0}, "Getting To Know All About You", function() { return "+70 Effort For Every Acquaintance";}, "effortSecondary", function(num) { if( $("#gettingtoknowallaboutyou").length > 0 && num > 0) {$("#gettingtoknowallaboutyou").remove();}flags.flag("gettingtoknowallaboutyou", 70); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("gettingtoknowallaboutyou", 0);});
	addPowerUp("joey", {effort: 50000, paperwork: 0, yessir: 0}, "Joey", function() { return "+10 Effort For Every Friend";}, "effortSecondary", function(num) { if( $("#joey").length > 0 && num > 0) {$("#joey").remove();}flags.flag("joey", 10); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("joey", 0);});
	addPowerUp("chandler", {effort: 222000, paperwork: 0, yessir: 0}, "Chandler", function() { return "+115 Effort For Every Friend";}, "effortSecondary", function(num) { if( $("#chandler").length > 0 && num > 0) {$("#chandler").remove();}flags.flag("chandler", 115); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("chandler", 0);});
	addPowerUp("budlight", {effort: 920000, paperwork: 0, yessir: 0}, "Bud Light", function() { return "+115 Effort For Every Bro";}, "effortSecondary", function(num) { if( $("#budlight").length > 0 && num > 0) {$("#budlight").remove();}flags.flag("budlight", 115); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("budlight", 0);});
	addPowerUp("collar", {effort: 3200000, paperwork: 0, yessir: 0}, "Popped Collar", function() { return "+420 Effort For Every Bro";}, "effortSecondary", function(num) { if( $("#collar").length > 0 && num > 0) {$("#collar").remove();}flags.flag("collar", 420); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("collar", 0);});
	addPowerUp("pizza", {effort: 720000, paperwork: 42000, yessir: 0}, "Pizza", function() { return "+500 Effort For Every Best Friend";}, "effortSecondary", function(num) { if( $("#pizza").length > 0 && num > 0) {$("#pizza").remove();}flags.flag("pizza", 500); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("pizza", 0);});
	addPowerUp("hideabody", {effort: 3200000, paperwork: 118000, yessir: 0}, "Hide A Body Maybe?", function() { return "+900 Effort For Every Best Friend";}, "effortSecondary", function(num) { if( $("#hideabody").length > 0 && num > 0) {$("#hideabody").remove();}flags.flag("hideabody", 900); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("hideabody", 0);});
	addPowerUp("idkmbffj", {effort: 1120000, paperwork: 77777, yessir: 0}, "IDK, my BFF Jill?", function() { return "+1234 Effort For Every BFF";}, "effortSecondary", function(num) { if( $("#idkmbffj").length > 0 && num > 0) {$("#idkmbffj").remove();}flags.flag("idkmbffj", 1234); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("idkmbffj", 0);});
	addPowerUp("instantgram", {effort: 9876543, paperwork: 300000, yessir: 0}, "Instant Gram (That's What The Kids Call It?)", function() { return "+5000 Effort For Every BFF";}, "effortSecondary", function(num) { if( $("#instantgram").length > 0 && num > 0) {$("#instantgram").remove();}flags.flag("instantgram", 5000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("instantgram", 0);});
	addPowerUp("objection", {effort: 4810000, paperwork: 1475000, yessir: 49000}, "OBJECTION!", function() { return "+25000 Effort For Every Personal Lawyer";}, "effortSecondary", function(num) { if( $("#objection").length > 0 && num > 0) {$("#objection").remove();}flags.flag("objection", 25000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("objection", 0);});
	addPowerUp("takethat", {effort: 10240000, paperwork: 6675000, yessir: 260000}, "TAKE THAT!!", function() { return "+50000 Effort For Every Personal Lawyer";}, "effortSecondary", function(num) { if( $("#takethat").length > 0 && num > 0) {$("#takethat").remove();}flags.flag("takethat", 50000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("takethat", 0);});
	addPowerUp("cohabitate", {effort: 21345589, paperwork: 9999990, yessir: 679000}, "Move In Together", function() { return "+150000 Effort For Every Significant Other";}, "effortSecondary", function(num) { if( $("#cohabitate").length > 0 && num > 0) {$("#cohabitate").remove();}flags.flag("cohabitate", 150000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("cohabitate", 0);});
	addPowerUp("cosign", {effort: 144233377, paperwork: 50000000, yessir: 4110000}, "Buy A House!", function() { return "+300000 Effort For Every Significant Other";}, "effortSecondary", function(num) { if( $("#cosign").length > 0 && num > 0) {$("#cosign").remove();}flags.flag("cosign", 300000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("cosign", 0);});
	addPowerUp("babypac", {effort: 231777551, paperwork: 32000000, yessir: 1241100}, "Baby PAC", function() { return "+1750000 Effort For Every Super PAC";}, "effortSecondary", function(num) { if( $("#babypac").length > 0 && num > 0) {$("#babypac").remove();}flags.flag("babypac", 1750000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("babypac", 0);});
	addPowerUp("mspac", {effort: 1557773120, paperwork: 68800000, yessir: 9000000}, "Ms. PAC", function() { return "+5000000 Effort For Every Super PAC";}, "effortSecondary", function(num) { if( $("#mspac").length > 0 && num > 0) {$("#mspac").remove();}flags.flag("mspac", 5000000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("mspac", 0);});
	addPowerUp("paperclips", {effort: 0, paperwork: 500, yessir: 0}, "Paperclips", function() { return "+2 Paperwork For Every Staples";}, "paperworkSecondary", function(num) { if( $("#paperclips").length > 0 && num > 0) {$("#paperclips").remove();}flags.flag("paperclips", 2); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("paperclips", 0);});
	addPowerUp("paperbinders", {effort: 0, paperwork: 45000, yessir: 0}, "Paper Binders", function() { return "+50 Paperwork For Every Staples";}, "paperworkSecondary", function(num) { if( $("#paperbinders").length > 0 && num > 0) {$("#paperbinders").remove();}flags.flag("paperbinders", 50); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("paperbinders", 0);});
	addPowerUp("sharpenedPencil", {effort: 0, paperwork: 7600, yessir: 0}, "Sharpened Pencil", function() { return "+5 Paperwork For Every Pencil";}, "paperworkSecondary", function(num) { if( $("#sharpenedPencil").length > 0 && num > 0) {$("#sharpenedPencil").remove();}flags.flag("sharpenedPencil", 5); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("sharpenedPencil", 0);});
	addPowerUp("mechanicalpencil", {effort: 0, paperwork: 620000, yessir: 0}, "Mechanical Pencil", function() { return "+70 Paperwork For Every Pencil";}, "paperworkSecondary", function(num) { if( $("#mechanicalpencil").length > 0 && num > 0) {$("#mechanicalpencil").remove();}flags.flag("mechanicalpencil", 70); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("mechanicalpencil", 0);});
	addPowerUp("moreink", {effort: 0, paperwork: 50000, yessir: 0}, "MORE. INK.", function() { return "+10 Paperwork For Every Pen";}, "paperworkSecondary", function(num) { if( $("#moreink").length > 0 && num > 0) {$("#moreink").remove();}flags.flag("moreink", 10); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("moreink", 0);});
	addPowerUp("cyberpen", {effort: 0, paperwork: 222000, yessir: 0}, "Cybernetic Pen", function() { return "+115 Paperwork For Every Pen";}, "paperworkSecondary", function(num) { if( $("#cyberpen").length > 0 && num > 0) {$("#cyberpen").remove();}flags.flag("cyberpen", 115); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("cyberpen", 0);});
	addPowerUp("wordprocessor", {effort: 0, paperwork: 920000, yessir: 0}, "Word Processor", function() { return "+115 Paperwork For Every Typewriter";}, "paperworkSecondary", function(num) { if( $("#wordprocessor").length > 0 && num > 0) {$("#wordprocessor").remove();}flags.flag("wordprocessor", 115); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("wordprocessor", 0);});
	addPowerUp("talktotext", {effort: 0, paperwork: 3200000, yessir: 0}, "Talk To Text", function() { return "+420 Paperwork For Every Typewriter";}, "paperworkSecondary", function(num) { if( $("#talktotext").length > 0 && num > 0) {$("#talktotext").remove();}flags.flag("talktotext", 420); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("talktotext", 0);});
	addPowerUp("laserprinter", {effort: 3110000, paperwork: 720000, yessir: 0}, "Laser Printer", function() { return "+500 Paperwork For Every Printer";}, "paperworkSecondary", function(num) { if( $("#laserprinter").length > 0 && num > 0) {$("#laserprinter").remove();}flags.flag("laserprinter", 500); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("laserprinter", 0);});
	addPowerUp("threeinone", {effort: 8240000, paperwork: 3200000, yessir: 0}, "Three In One Printer", function() { return "+900 Paperwork For Every Printer";}, "paperworkSecondary", function(num) { if( $("#threeinone").length > 0 && num > 0) {$("#threeinone").remove();}flags.flag("threeinone", 900); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("threeinone", 0);});
	addPowerUp("lycos", {effort: 5120000, paperwork: 1120000, yessir: 0}, "Lycos", function() { return "+1234 Paperwork For Every Email Address";}, "paperworkSecondary", function(num) { if( $("#lycos").length > 0 && num > 0) {$("#lycos").remove();}flags.flag("lycos", 1234); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("lycos", 0);});
	addPowerUp("compuserve", {effort: 42420000, paperwork: 9876543, yessir: 0}, "CompuServe", function() { return "+5000 Paperwork For Every Email Address";}, "paperworkSecondary", function(num) { if( $("#compuserve").length > 0 && num > 0) {$("#compuserve").remove();}flags.flag("compuserve", 5000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("compuserve", 0);});
	addPowerUp("gruel", {effort: 16140000, paperwork: 4810000, yessir: 721000}, "Bowls Of Gruel", function() { return "+25000 Paperwork For Every Flock of orphans with your handwriting";}, "paperworkSecondary", function(num) { if( $("#gruel").length > 0 && num > 0) {$("#gruel").remove();}flags.flag("gruel", 25000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("gruel", 0);});
	addPowerUp("posters", {effort: 616100000, paperwork: 10240000, yessir: 3210000}, "Motivational Posters!", function() { return "+50000 Paperwork For Every Flock of orphans with your handwriting";}, "paperworkSecondary", function(num) { if( $("#posters").length > 0 && num > 0) {$("#posters").remove();}flags.flag("posters", 50000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("posters", 0);});
	addPowerUp("laserguns", {effort: 397110000, paperwork: 21345589, yessir: 679000}, "Laser Guns", function() { return "+150000 Paperwork For Every Robots. God damned robots.";}, "paperworkSecondary", function(num) { if( $("#laserguns").length > 0 && num > 0) {$("#laserguns").remove();}flags.flag("laserguns", 150000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("laserguns", 0);});
	addPowerUp("sentience", {effort: 1337000000, paperwork: 144233377, yessir: 4110000}, "Sentience", function() { return "+300000 Paperwork For Every Robots. God damned robots.";}, "paperworkSecondary", function(num) { if( $("#sentience").length > 0 && num > 0) {$("#sentience").remove();}flags.flag("sentience", 300000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("sentience", 0);});
	addPowerUp("matrix", {effort: 794220000, paperwork: 64036767, yessir: 2716000}, "Matrix of...Eh.", function() { return "+1750000 Paperwork For Every Living planet with amazing handwriting";}, "paperworkSecondary", function(num) { if( $("#matrix").length > 0 && num > 0) {$("#matrix").remove();}flags.flag("matrix", 1750000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("matrix", 0);});
	addPowerUp("disc", {effort: 1588440000, paperwork: 177407054, yessir: 5432000}, "Silver Disc", function() { return "+5000000 Paperwork For Every Living planet with amazing handwriting";}, "paperworkSecondary", function(num) { if( $("#disc").length > 0 && num > 0) {$("#disc").remove();}flags.flag("disc", 5000000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("disc", 0);});
	addPowerUp("tyler", {effort: 0, paperwork: 0, yessir: 500}, "John Tyler", function() { return "+2 Yes Sir For Every \"Tippecanoe and Tyler Too!\"";}, "yessirSecondary", function(num) { if( $("#tyler").length > 0 && num > 0) {$("#tyler").remove();}flags.flag("tyler", 2); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("tyler", 0);});
	addPowerUp("harrison", {effort: 0, paperwork: 0, yessir: 45000}, "William Henry Harrison", function() { return "+50 Yes Sir For Every \"Tippecanoe and Tyler Too!\"";}, "yessirSecondary", function(num) { if( $("#harrison").length > 0 && num > 0) {$("#harrison").remove();}flags.flag("harrison", 50); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("harrison", 0);});
	addPowerUp("barkley", {effort: 0, paperwork: 0, yessir: 7600}, "Alben W. Barkley", function() { return "+5 Yes Sir For Every \"Give 'Em Hell, Harry!\"";}, "yessirSecondary", function(num) { if( $("#barkley").length > 0 && num > 0) {$("#barkley").remove();}flags.flag("barkley", 5); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("barkley", 0);});
	addPowerUp("truman", {effort: 0, paperwork: 0, yessir: 620000}, "Harry S. Truman", function() { return "+70 Yes Sir For Every \"Give 'Em Hell, Harry!\"";}, "yessirSecondary", function(num) { if( $("#truman").length > 0 && num > 0) {$("#truman").remove();}flags.flag("truman", 70); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("truman", 0);});
	addPowerUp("nixon", {effort: 0, paperwork: 0, yessir: 50000}, "Richard Nixon", function() { return "+10 Yes Sir For Every \"I Like Ike!\"";}, "yessirSecondary", function(num) { if( $("#nixon").length > 0 && num > 0) {$("#nixon").remove();}flags.flag("nixon", 10); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("nixon", 0);});
	addPowerUp("eisenhower", {effort: 0, paperwork: 0, yessir: 222000}, "Dwight D. Eisenhower", function() { return "+115 Yes Sir For Every \"I Like Ike!\"";}, "yessirSecondary", function(num) { if( $("#eisenhower").length > 0 && num > 0) {$("#eisenhower").remove();}flags.flag("eisenhower", 115); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("eisenhower", 0);});
	addPowerUp("johnson", {effort: 0, paperwork: 0, yessir: 920000}, "Lyndon B. Johnson", function() { return "+115 Yes Sir For Every \"A Time For Greatness\"";}, "yessirSecondary", function(num) { if( $("#johnson").length > 0 && num > 0) {$("#johnson").remove();}flags.flag("johnson", 115); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("johnson", 0);});
	addPowerUp("kennedy", {effort: 0, paperwork: 0, yessir: 3200000}, "John F. Kennedy", function() { return "+420 Yes Sir For Every \"A Time For Greatness\"";}, "yessirSecondary", function(num) { if( $("#kennedy").length > 0 && num > 0) {$("#kennedy").remove();}flags.flag("kennedy", 420); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("kennedy", 0);});
	addPowerUp("quayle", {effort: 18660000, paperwork: 18660000, yessir: 18660000}, "Dan Quayle", function() { return "+500 Yes Sir For Every \"No New Taxes\"";}, "yessirSecondary", function(num) { if( $("#quayle").length > 0 && num > 0) {$("#quayle").remove();}flags.flag("quayle", 500); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("quayle", 0);});
	addPowerUp("bush", {effort: 49440000, paperwork: 49440000, yessir: 49440000}, "George H. W. Bush", function() { return "+900 Yes Sir For Every \"No New Taxes\"";}, "yessirSecondary", function(num) { if( $("#bush").length > 0 && num > 0) {$("#bush").remove();}flags.flag("bush", 900); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("bush", 0);});
	addPowerUp("gore", {effort: 30720000, paperwork: 30720000, yessir: 30720000}, "Al Gore", function() { return "+1234 Yes Sir For Every \"It's Time To Change America\"";}, "yessirSecondary", function(num) { if( $("#gore").length > 0 && num > 0) {$("#gore").remove();}flags.flag("gore", 1234); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("gore", 0);});
	addPowerUp("clinton", {effort: 254520000, paperwork: 254520000, yessir: 254520000}, "Bill Clinton", function() { return "+5000 Yes Sir For Every \"It's Time To Change America\"";}, "yessirSecondary", function(num) { if( $("#clinton").length > 0 && num > 0) {$("#clinton").remove();}flags.flag("clinton", 5000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("clinton", 0);});
	addPowerUp("biden", {effort: 96840000, paperwork: 96840000, yessir: 96840000}, "Joe Biden", function() { return "+25000 Yes Sir For Every \"Change\"";}, "yessirSecondary", function(num) { if( $("#biden").length > 0 && num > 0) {$("#biden").remove();}flags.flag("biden", 25000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("biden", 0);});
	addPowerUp("obama", {effort: 3696600000, paperwork: 3696600000, yessir: 3696600000}, "Barack Obama", function() { return "+50000 Yes Sir For Every \"Change\"";}, "yessirSecondary", function(num) { if( $("#obama").length > 0 && num > 0) {$("#obama").remove();}flags.flag("obama", 50000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("obama", 0);});
	addPowerUp("morelube", {effort: 2382660000, paperwork: 2382660000, yessir: 2382660000}, "More Lube", function() { return "+150000 Yes Sir For Every \"Free Sexual Favors For Everyone!\"";}, "yessirSecondary", function(num) { if( $("#morelube").length > 0 && num > 0) {$("#morelube").remove();}flags.flag("morelube", 150000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("morelube", 0);});
	addPowerUp("chickenmeanscock", {effort: 8022000000, paperwork: 8022000000, yessir: 8022000000}, "A \"Chicken\" In Every \"Pot\"", function() { return "+300000 Yes Sir For Every \"Free Sexual Favors For Everyone!\"";}, "yessirSecondary", function(num) { if( $("#chickenmeanscock").length > 0 && num > 0) {$("#chickenmeanscock").remove();}flags.flag("chickenmeanscock", 300000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("chickenmeanscock", 0);});
	addPowerUp("jobs", {effort: 4765320000, paperwork: 4765320000, yessir: 4765320000}, "\"Jobs For Everyone, For Real!\"", function() { return "+1750000 Yes Sir For Every \"Here, Have Some Empty Promises\"";}, "yessirSecondary", function(num) { if( $("#jobs").length > 0 && num > 0) {$("#jobs").remove();}flags.flag("jobs", 1750000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("jobs", 0);});
	addPowerUp("hungryhungry", {effort: 9530640000, paperwork: 9530640000, yessir: 9530640000}, "\"I Will End World Hunger Forever.\"", function() { return "+5000000 Yes Sir For Every \"Here, Have Some Empty Promises\"";}, "yessirSecondary", function(num) { if( $("#hungryhungry").length > 0 && num > 0) {$("#hungryhungry").remove();}flags.flag("hungryhungry", 5000000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("hungryhungry", 0);});
	addPowerUp("grindstone", {effort: 1100, paperwork: 0, yessir: 0}, "Nose To The Grindstone", function() {return "+5 Effort For Every Click";}, "effortTertiary", function(num) { if( $("#grindstone").length > 0 && num > 0) {$("#grindstone").remove();} flags.flag("grindstone", 5); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("grindstone", 0);});
	addPowerUp("back", {effort: 21000, paperwork: 0, yessir: 0}, "Put Your Back Into It", function() {return "+75 Effort For Every Click";}, "effortTertiary", function(num) { if( $("#back").length > 0 && num > 0) {$("#back").remove();} flags.flag("back", 75); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("back", 0);});
	addPowerUp("pain", {effort: 480000, paperwork: 0, yessir: 0}, "No Pain, No Gain", function() {return "+500 Effort For Every Click";}, "effortTertiary", function(num) { if( $("#pain").length > 0 && num > 0) {$("#pain").remove();} flags.flag("pain", 500); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("pain", 0);});
	addPowerUp("mile", {effort: 3456000, paperwork: 0, yessir: 0}, "Go The Extra Mile", function() {return "+2500 Effort For Every Click";}, "effortTertiary", function(num) { if( $("#mile").length > 0 && num > 0) {$("#mile").remove();} flags.flag("mile", 2500); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("mile", 0);});
	addPowerUp("believe", {effort: 9999990, paperwork: 0, yessir: 0}, "Believe In Yourself", function() {return "+30000 Effort For Every Click";}, "effortTertiary", function(num) { if( $("#believe").length > 0 && num > 0) {$("#believe").remove();} flags.flag("believe", 30000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("believe", 0);});*/
	
	flags.flag("multiplier", 1);	//This is not the greatest variable in the code. No. This is just a tribute.
	buildPows();					//TEMPORARY FUNCTION!
	
	//call the two functions below AFTER loading from localStorage
	$("#nosupport").hide();
	Load();
	updatePastGoals();
	updateCurrentGoals();
	
	buildTabs();
	
	recalculate();
	
	setInterval(Save, 1000*30);	//Save every 30 seconds	
	setInterval(recalculate, 1000/100);	//Recalculate EPS/PPS/YPS every 1/10th of a second; it's less stress!
	
	resizer();

	setInterval(function() {	//check for updates every 30 minutes!
		$.ajax("status.html").done(function(data) {
			if(currNotes != data) {
				var myAlert = null;
				if(document.getElementById("myAlert")) myAlert = $("#myAlert");
				else myAlert = $("<div>");
				myAlert.attr("id", "myAlert");
				$("body").append(myAlert);
				myAlert.html("A change has gone live for GetElected! Here are the notes:<br /><br />" + data);
				myAlert.css({"position": "absolute", "top": "50%", "left": "50%", "margin": "-" + (myAlert.height() / 2) + "px 0 0 -" +(myAlert.width() / 2) + "px" });
				myAlert.fadeIn(1000).delay(15000).fadeOut(1000);
			}
		});
	}, 1000 * 60 * 30);
	
	$.ajax("status.html").done(function(data) {
		currNotes = data;
	});

	/*
	setInterval(function() {	//JUST to make sure that effort is calculating correctly, as there are worries that it is not correct.
		console.log("Last Second: " + lastEffort + "      Current Second: " + efforttally + "     Difference: " + (efforttally - lastEffort));
		console.log("EPS " + eps);
		console.log("What " + (eps / fps));
		lastEffort = efforttally;
	}, 1000);*/
	
	//Last but not least, let's get some shit in place to track FPS, JUUUUST in case things start running slow.
	lastRun = new Date().getTime();
	if(startDate === 0 || isNaN(startDate)) startDate = (new Date()).getTime();
	
	fiveCol();
	Loop();
}