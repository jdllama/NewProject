var Game = {};

Game.version = "v. ALPHA";
Game.currNotes = "";

/*
	Game.Goal
		id:				String ID to be used to generate the list of goals; when the goal is clicked on, we use the li's ID to science.
		name:			String name of the goal
		reqObj:			Object of the requirements to hit the goal.
			Format:		{effort: 0, paperwork: 0, yessir: 0}
		unlocks:		function that executes when requirements are met. Use this to show next requirements; do NOT use this to show/hide goals
*/

Game.Goal = function(name, reqObj, unlocks) {
	this.name = name;
	this.reqObj = reqObj;
	this.unlocks = unlocks;
	this.unlocks = unlocks;
	return this;
}

Game.Initialize = function() {	
	var efforttally = paperworktally = yessirtally = 0;
	var currentGoalIndex = 0;
	var scrollerBase = 10;	//An arbitrary number; this is where the (hidden) scroll bar will lock itself on scroll for the Yes Sir section.
	var scrollStatus = "";
	var fps = 5;
	var lastEffort = 0;
	var efforttoggle = 1;
	var totalEffortClicks = 0;
	var totalEffortGained = 0;
	var totalPaperworkWiggles = 0;
	var totalYessirScrolls = 0;
	var totalRestart = 0;
	var startDate = 0;
	var randSpawnTimer = null;
	
	Game.compInt = function(base, times) {
		return Math.floor(base * Math.pow(1+interest, times));
	}

	Game.reverseCompInt = function(base, times) {
		return Math.floor(base / Math.pow(1+interest, times));
	}
	
	var autogoal = false;

	var interest = 0.27;	//Be sure to tip your costs, and drive home safe!
	var missedFrames = 0;	//How many frames are missed due to latency / the window not being in focus
	Game.incrementEffort = function(num) {
		efforttally += num;
		totalEffortGained += num;
		totalEffortGained = Math.round(totalEffortGained);
		if(efforttally <= 0) {
			efforttally = 0;
		}
	}
	Game.incrementPaperwork = function(num) {
		paperworktally += num;
		if(paperworktally <= 0) {
			paperworktally = 0;
		}
	}
	Game.incrementYessir = function(num) {
		yessirtally += num;
		if(yessirtally <= 0) {
			yessirtally = 0;
		}
	}

	Game.updatePastGoals = function() {
		$("#pastGoals").empty();
		for(var i = 0;i<currentGoalIndex && i < goals.length;i++) {
			var currGoal = goals[i];
			var li = $("<li>");
			$("#pastGoals").prepend(li);
			var q = $("<q>");
			var html = "";
			html += (currGoal.reqObj.effort !== 0 ? "Effort: " + numberWithCommas(currGoal.reqObj.effort.toFixed(0)) : "") + " ";
			html += (currGoal.reqObj.paperwork !== 0 ? "Paperwork: " + numberWithCommas(currGoal.reqObj.paperwork.toFixed(0)) : "") + " ";
			html += (currGoal.reqObj.yessir !== 0 ? "Yes Sir: " + numberWithCommas(currGoal.reqObj.yessir.toFixed(0)) : "");
			q.html(html);
			li.html(currGoal.name);
			li.append(q);
			currGoal.unlocks();
		}
	}
	
	Game.addPastGoal = function(currGoal) {
		var li = $("<li>");
		$("#pastGoals").prepend(li);
		var q = $("<q>");
		var html = "";
		html += (currGoal.reqObj.effort !== 0 ? "Effort: " + numberWithCommas(currGoal.reqObj.effort.toFixed(0)) : "") + " ";
		html += (currGoal.reqObj.paperwork !== 0 ? "Paperwork: " + numberWithCommas(currGoal.reqObj.paperwork.toFixed(0)) : "") + " ";
		html += (currGoal.reqObj.yessir !== 0 ? "Yes Sir: " + numberWithCommas(currGoal.reqObj.yessir.toFixed(0)) : "");
		q.html(html);
		li.html(currGoal.name);
		li.append(q);
		li.addClass("disabled");
	}
	
	Game.log = function(str) {
		var newLog = $("<div>");
		newLog.addClass("log").html(str);
		$("body").append(newLog);
		newLog.css({"position": "absolute", "bottom": "0px", "left": "50%", "z-index": "999000", "opacity": "0"});
		$(".log").each(function() {
			$(this).animate({bottom: "+=" + $(this).height()}, 500);
		});
		newLog.animate(
			{opacity: 1},
			{duration: 1000, queue: false, complete: function() {
				var obj = this;
				setTimeout(function() {
					$(obj).animate(
						{bottom: "+=" + $(obj).height(), opacity: 0},
						{duration: 1000, complete: function() {
								$(this).remove();
							}
						}
					);
				}, 5000);
			}
		});
	}
	
	Game.updateCurrentGoals = function() {
		$("#currentGoal").empty();
		var currGoal = goals[currentGoalIndex];
		if(!currGoal) {
			var li = $("<span>");
			$("#currentGoal").append(li);
			var html = "End Game";
			li.html(html);
		}
		else {
			var li = $("<span>");
			$("#currentGoal").append(li);
			/*var q = $("<q>");
			var html = "";
			html += (currGoal.reqObj.effort !== 0 ? "Effort: " + numberWithCommas(currGoal.reqObj.effort.toFixed(0)) : "") + " ";
			html += (currGoal.reqObj.paperwork !== 0 ? "Paperwork: " + numberWithCommas(currGoal.reqObj.paperwork.toFixed(0)) : "") + " ";
			html += (currGoal.reqObj.yessir !== 0 ? "Yes Sir: " + numberWithCommas(currGoal.reqObj.yessir.toFixed(0)) : "");
			q.html(html);
			*/
			$("#effortgoal").html("Current&nbsp;Goal:&nbsp;" + numberWithCommas(currGoal.reqObj.effort.toFixed(0)));
			$("#paperworkgoal").html("Current&nbsp;Goal:&nbsp;" + numberWithCommas(currGoal.reqObj.paperwork.toFixed(0)));
			$("#yessirgoal").html("Current&nbsp;Goal:&nbsp;" + numberWithCommas(currGoal.reqObj.yessir.toFixed(0)));
			li.html(currGoal.name);
			//li.append(q);
			li.click(function(goal) {
				return function() {
					if(efforttally >= goal.reqObj.effort &&
						paperworktally >= goal.reqObj.paperwork &&
						yessirtally >= goal.reqObj.yessir) {
							goal.unlocks();
							currentGoalIndex++;
							efforttally -= goal.reqObj.effort;
							paperworktally -= goal.reqObj.paperwork;
							yessirtally -= goal.reqObj.yessir;
							Game.addPastGoal(goal);
							Game.updateCurrentGoals();
							Game.resizer();
					}
				}
			}(currGoal));
		}
	}
	
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

		Game.incrementEffort(howMuch);
		
		/*
			PRETTY PRETTY ANIMATIONS, DAMMIT
		*/
		var obj = $("#effortclone").clone();
		obj.html("+" + howMuch);
		$("body").append(obj);
		var left = 15 * efforttoggle;
		efforttoggle *= -1;
		obj.offset({left: e.pageX, top: e.pageY - 30});
		obj.css("opacity", 100);
		obj.animate({"opacity": 0, "top": (e.pageY - 60), "left": e.pageX - left}, 500, function() {
			$(this).remove();
		});
		Game.Draw();
	});
	
	$("#efforter").mousedown(function(e) {
		$(this).stop().animate({boxShadow: '3px 3px 3px', top: 6}, "fast")
	});
	
	$("#efforter").mouseup(function(e) {
		$(this).stop().animate({boxShadow: '0px 9px 0px rgba(219,31,5,1)', top: 0}, "fast")
	});
	
	$("#paperworker").mousemove(function(e) {
		var howMuch = 1/20;
		howMuch *= flags.flag("multiplier");
		Game.incrementPaperwork(howMuch);
		/*
			PRETTY PRETTY ANIMATIONS, DAMMIT
		*/
		if(Math.random() < 0.17) {
			var obj = $("#effortclone").clone();
			obj.html("+" + howMuch);
			$("body").append(obj);
			var left = 15 * efforttoggle;
			efforttoggle *= -1;
			obj.offset({left: e.pageX, top: e.pageY - 30});
			obj.css("opacity", 100);
			obj.animate({"opacity": 0, "top": (e.pageY - 60), "left": e.pageX - left}, 500, function() {
				$(this).remove();
			});
		}
		
		Game.Draw();
	});
	
	$("#yessirer").scroll( function(e) {
		$(this).removeClass("neutral");
		var scrollerLoc = $(this).scrollTop();
		if(scrollStatus === "") {	//Status not yet set! SUCCESS, BITCHES
			Game.incrementYessir(1);
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
					Game.incrementYessir(howMuch);
					scrollStatus = "U";
					$(this).removeClass("down");
					$(this).addClass("up");
				}
				else if(scrollerLoc > scrollerBase && scrollStatus === "U") {	//See comment above, but opposite it!...No, not the "Status not yet set" comment. Sheesh.
					Game.incrementYessir(howMuch);
					scrollStatus = "D";
					$(this).removeClass("up");
					$(this).addClass("down");
				}
			}
			Game.Draw();
		}
		$(this).scrollTop(scrollerBase);
	});
	
	$("#save").click(function() {
		Game.Save();
	});
	
	$("#reset").click(function() {
		if(confirm("Are you sure you want to reset?")) {
			Game.Reset();
			Game.Save();
			Game.Load();
			Game.updatePastGoals();
			Game.updateCurrentGoals();
			twoCol();
		}
	});
	
	$("#export").click(function() {
		Game.Save();
		Game.Export();
	});
	
	$("#import").click(function() {
		Game.Import();
	});
	
	var addGoal = function(name, reqObj, unlocks) {
		goals[goals.length] = new Game.Goal(name, reqObj, unlocks);
	}
	
	var randomCreate = function(pre) {	//if it gets pre passed to it, then it's not random
		clearTimeout(randSpawnTimer);	//JUUUUST in case.
		var life = 1000 * 15;		//Life will last fifteen seconds. SO MACABRE.
		var width = height = 200;	//it will be 200 pixels in size.
		var x = y = 0;
		var myrand = $("<div>");
		myrand.addClass("random");
		$("body").append(myrand);
		
		x = getRandomInt(0, $("#game").width() - width);
		y = getRandomInt($("#game").offset().top, ($("#game").height() + $("#game").offset().top) - height);
		myrand.css({"top": y + "px", "left": x + "px"});
		myrand.fadeIn(5000);
		
		pre = pre || "";
		
		myrand.click(function(e) {
			clearTimeout(randTimer);
			$(this).remove();
			if(pre === "firstone") {
				flags.flag("multiplier", 2);
				Game.recalculate();
				setTimeout(function() {
					flags.flag("multiplier", 1);
					Game.recalculate();
				}, 1000 * 60);
				html = "First One's Free: Resource generation 2x for 60 seconds";
			}
			else {
				/*
					Possible results:
						caucus:			+10% of all resources (one time)
						gridlock:		all resource generating halved for 60 seconds
						landslide:		8x resource generating for 30 seconds
						lameduck:		-10% of all resources (one time)
				*/
				var results = ["caucus", "gridlock", "landslide", "lameduck"];
				var weight = [0.50, 0.05, 0.05, 0.10];
				
				//weighted random from http://codetheory.in/weighted-biased-random-number-generation-with-javascript-based-on-probability/
				
				var weighed_list = [];

				// Loop over weights
				for (var i = 0; i < weight.length; i++) {
					var multiples = weight[i] * 100;

					// Loop over the list of items
					for (var j = 0; j < multiples; j++) {
						weighed_list.push(results[i]);
					}
				}
				var index = getRandomInt(0, weighed_list.length - 1);
				var lucky = weighed_list[index];
				var html = "";
				if(lucky === "caucus") {
					Game.incrementEffort(efforttally * .1);
					Game.incrementPaperwork(paperworktally * .1);
					Game.incrementYessir(yessirtally * .1);
					html = "Caucus: +10% all resources";
				}
				else if(lucky === "gridlock") {
					flags.flag("multiplier", 0.5);
					Game.recalculate();
					setTimeout(function() {
						flags.flag("multiplier", 1);
						Game.recalculate();
					}, 1000 * 60);
					html = "Gridlock: Resource generation halved for one minute";
				}
				else if(lucky === "landslide") {
					flags.flag("multiplier", 8);
					Game.recalculate();
					setTimeout(function() {
						flags.flag("multiplier", 1);
						Game.recalculate();
					}, 1000 * 30);
					html = "Landslide: Resource generation 8x for 30 seconds";
				}
				else if(lucky === "lameduck") {
					Game.incrementEffort(-efforttally * .1);
					Game.incrementPaperwork(-paperworktally * .1);
					Game.incrementYessir(-yessirtally * .1);
					html = "Lame Duck: -10% all resources";
				}
			}
			Game.log(html);
			/*var obj = $("#log").clone();
			obj.html(html);
			$("body").append(obj);
			obj.css({"display": "none", "position": "absolute", "z-index": "66669999", "bottom": (40 + obj.height()) + "px", "left": "50%", "margin": "0 0 0 -" + (obj.width() / 2) + "px"});
			obj.fadeIn(1000).delay(5000);
			obj.fadeOut(1000, function() {
				$(this).remove();
			});
			*/
			randomSpawn();
		});
		var randTimer = setTimeout(function() {
			myrand.fadeOut(5000, function() {
				$(this).remove();
				randomSpawn();
			});
		}, life);
	}
	
	var randomSpawn = function() {
		var oneMinute = 1000 * 60;	//Just...just to keep typing down. Yeah.
		var min = 3;
		var max = 7;
		var result = getRandomInt(min, max) * oneMinute;
		console.log("Next random spawn in " + result + "ms. You're welcome.");
		randSpawnTimer = setTimeout(randomCreate, result);
	}
	
	var ticker = ["Eventually, something clever goes here.", "Something witty goes here, like, all British-humour-like.", "Man, I hope this is funny."];
	var tickerIndex = 0;
	
	var ticketReset = function() {
		tickerIndex = 0;
	}
	
	var tickerChange = function() {
		if(tickerIndex >= ticker.length) tickerIndex = 0;
		var whichTick = ticker[tickerIndex];
		$("#ticker").html(whichTick);
		
		tickerIndex++;
		if(tickerIndex >= ticker.length) tickerIndex = 0;
	}
	
	tickerChange();
	
	setInterval(tickerChange, 1000*15);

	var goals = [
		new Game.Goal("Class Clown", {effort: 75, paperwork: 0, yessir: 0}, function() {$("#effortdescribe").hide("slow");}),
		new Game.Goal("Hall Monitor", {effort: 150, paperwork: 0, yessir: 0}, function() {}),
		new Game.Goal("Class Treasurer", {effort: 300, paperwork: 0, yessir: 0}, function() {}),
		new Game.Goal("Class Vice President", {effort: 600, paperwork: 0, yessir: 0}, function() {}),
		new Game.Goal("Class President", {effort: 1800, paperwork: 0, yessir: 0}, function() {}),
		new Game.Goal("Prom Royalty", {effort: 5400, paperwork: 0, yessir: 0}, function() {}),
		new Game.Goal("Sports Captain", {effort: 16200, paperwork: 0, yessir: 0}, function() {threeCol();}),
		new Game.Goal("Fry Cook", {effort: 32400, paperwork: 75, yessir: 0}, function() {$("#paperworkdescribe").hide("slow");}),
		new Game.Goal("Assistant Assistant Manager", {effort: 97200, paperwork: 150, yessir: 0}, function() {}),
		new Game.Goal("Assistant Manager", {effort: 291600, paperwork: 300, yessir: 0}, function() {}),
		new Game.Goal("General Manager", {effort: 583200, paperwork: 600, yessir: 0}, function() {}),
		new Game.Goal("District Manager", {effort: 1749600, paperwork: 1800, yessir: 0}, function() {}),
		new Game.Goal("PTA Treasurer", {effort: 3499200, paperwork: 5400, yessir: 0}, function() {}),
		new Game.Goal("PTA Vice President", {effort: 13996800, paperwork: 16200, yessir: 0}, function() {}),
		new Game.Goal("PTA President", {effort: 27993600, paperwork: 32400, yessir: 0}, function() {}),
		new Game.Goal("City Council", {effort: 111974400, paperwork: 97200, yessir: 0}, function() {}),
		new Game.Goal("Deputy Mayor", {effort: 335923200, paperwork: 291600, yessir: 0}, function() {fourCol();}),
		new Game.Goal("Mayor", {effort: 671846400, paperwork: 583200, yessir: 75}, function() {$("#yessirdescribe").hide("slow");}),
		new Game.Goal("Judge", {effort: 1343692800, paperwork: 1749600, yessir: 150}, function() {}),
		new Game.Goal("Lieutenant Governor", {effort: 2687385600, paperwork: 3499200, yessir: 300}, function() {}),
		new Game.Goal("Governor", {effort: 10749542400, paperwork: 13996800, yessir: 600}, function() {}),
		new Game.Goal("Senator", {effort: 21499084800, paperwork: 27993600, yessir: 1800}, function() {}),
		new Game.Goal("Vice President", {effort: 85996339200, paperwork: 111974400, yessir: 5400}, function() {}),
		new Game.Goal("President of the United States", {effort: 343985356800, paperwork: 335923200, yessir: 16200}, function() {}),
		new Game.Goal("Head of United Nations", {effort: 1031956070400, paperwork: 671846400, yessir: 32400}, function() {}),
		new Game.Goal("President of the Western Hemisphere", {effort: 2063912140800, paperwork: 1343692800, yessir: 97200}, function() {}),
		new Game.Goal("President of Earth", {effort: 6191736422400, paperwork: 2687385600, yessir: 291600}, function() {}),
		new Game.Goal("President of the Solar System", {effort: 18575209267200, paperwork: 10749542400, yessir: 583200}, function() {}),
		new Game.Goal("President of the Solar Interstellar Neighborhood", {effort: 37150418534400, paperwork: 21499084800, yessir: 1749600}, function() {}),
		new Game.Goal("President of the Milky Way Galaxy", {effort: 74300837068800, paperwork: 85996339200, yessir: 3499200}, function() {}),
		new Game.Goal("President of the Local Galactic Group", {effort: 148601674137600, paperwork: 343985356800, yessir: 13996800}, function() {}),
		new Game.Goal("President of the Virgo Supercluster", {effort: 297203348275200, paperwork: 1031956070400, yessir: 27993600}, function() {}),
		new Game.Goal("President of all Local Superclusters", {effort: 1188813393100800, paperwork: 2063912140800, yessir: 111974400}, function() {}),
		new Game.Goal("President of the Observable Universe", {effort: 2377626786201600, paperwork: 6191736422400, yessir: 335923200}, function() {}),
		new Game.Goal("President of Universe, Observable or Not", {effort: 9510507144806400, paperwork: 18575209267200, yessir: 671846400}, function() {}),
		new Game.Goal("President of The Multiverse", {effort: 38042028579225600, paperwork: 37150418534400, yessir: 1343692800}, function() {}),
		new Game.Goal("President of Time", {effort: 76084057158451200, paperwork: 74300837068800, yessir: 2687385600}, function() {}),
		new Game.Goal("Vice God", {effort: 152168114316902400, paperwork: 148601674137600, yessir: 10749542400}, function() {}),
		new Game.Goal("God", {effort: 456504342950707200, paperwork: 297203348275200, yessir: 21499084800}, function() {}),
		new Game.Goal("Ultra God", {effort: 1369513028852121600, paperwork: 1188813393100800, yessir: 85996339200}, function() {})
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
	
	var powerups = {};			//this is the one that will be saved! THIS ONE! It will contain an id, and the number of how many of each power up the player has.
	var powerupsfuncs = {};		//this is what will hold the id of the powerup, the cost(s?), the label, what section it goes to, and the function that will execute every frame during Game.Update().
	
	/*
		id:				id of the power up
		cost:			object, in the format of {effort: 10, paperwork: 0, yessir: 0}
		lable:			Primary Label of the Power Up
		description:	Secondary description of power up (Flavor text!)
		section:		Where it will go to. Either effortPowerUp, paperworkPowerUp, or yessirPowerUp
		func:			function that executes every 1000/fps ms. MUST ALWAYS RETURN OBJECT IN THE FOLLOWING FORMAT:	
			{
				"effort": 1*num,
				"paperwork": 0*num,
				"yessir": 0*num
			};
		onetime:		If this is null, do nothing. Otherwise, it's a function that runs just once.
	*/
	var addPowerUp = function(id, cost, label, description, section, func, onetime, sell) {
		powerups[id] = 0;
		powerupsfuncs[id] = {
			"cost": cost,
			"label": label,
			"section": section,
			"description": description,
			"func": func,
			"onetime": onetime,
			"sell": sell || null
		};
	}
	
	addPowerUp("stranger", {effort: 15, paperwork: 0, yessir: 0}, "Stranger", "+0.1 Effort Per Second", "effortPrimary", function(num) {return {"effort": (0.1 + flags.flag("perfectstrangers") + flags.flag("perfectstrangers2")) * num,"paperwork": 0,"yessir": 0};}, false);
	addPowerUp("acquaintance", {effort: 100, paperwork: 0, yessir: 0}, "Acquaintance", "+0.5 Effort Per Second", "effortPrimary", function(num) {return {"effort": (0.5 + flags.flag("gettingtoknowyou") + flags.flag("gettingtoknowallaboutyou")) * num,"paperwork": 0,"yessir": 0};}, false);
	addPowerUp("friend", {effort: 900, paperwork: 0, yessir: 0}, "Friend", "+3 Effort Per Second", "effortPrimary", function(num) {return {"effort": (3 + flags.flag("joey") + flags.flag("chandler")) * num,"paperwork": 0,"yessir": 0};}, false);
	addPowerUp("bro", {effort: 25437, paperwork: 0, yessir: 0}, "Bro", "+50 Effort Per Second", "effortPrimary", function(num) {return {"effort": (50 + flags.flag("budlight") + flags.flag("collar")) * num,"paperwork": 0,"yessir": 0};}, false);
	addPowerUp("bestfriend", {effort: 150000, paperwork: 5000, yessir: 0}, "Best Friend", "+300 Effort Per Second", "effortPrimary", function(num) {return {"effort": (300 + flags.flag("pizza") + flags.flag("hideabody")) * num,"paperwork": 0,"yessir": 0};}, false);
	addPowerUp("bff", {effort: 314159, paperwork: 133700, yessir: 0}, "BFF", "+2400 Effort Per Second", "effortPrimary", function(num) {return {"effort": (2400 + flags.flag("idkmbffj") + flags.flag("instantgram")) * num,"paperwork": 0,"yessir": 0};}, false);
	addPowerUp("personallawyer", {effort: 1000000, paperwork: 675000, yessir: 10000}, "Personal Lawyer", "+9999 Effort Per Second", "effortPrimary", function(num) {return {"effort": (9999 + flags.flag("objection") + flags.flag("takethat")) * num,"paperwork": 0,"yessir": 0};}, false);
	addPowerUp("sigother", {effort: 11235813, paperwork: 3333360, yessir: 270000}, "Significant Other", "+70000 Effort Per Second", "effortPrimary", function(num) {return {"effort": (70000 + flags.flag("cohabitate") + flags.flag("cosign")) * num,"paperwork": 0,"yessir": 0};}, false);
	addPowerUp("superpac", {effort: 81000000, paperwork: 7598950, yessir: 999000}, "Super PAC", "+500000 Effort Per Second", "effortPrimary", function(num) {return {"effort": (500000 + flags.flag("babypac") + flags.flag("mspac")) * num,"paperwork": 0,"yessir": 0};}, false);
	addPowerUp("staples", {effort: 0, paperwork: 15, yessir: 0}, "Staples", "+0.1 Paperwork Per Second", "paperworkPrimary", function(num) {return {"effort": 0,"paperwork": (0.1 + flags.flag("paperclips") + flags.flag("paperbinders")) * num,"yessir": 0};}, false);
	addPowerUp("pencil", {effort: 0, paperwork: 100, yessir: 0}, "Pencil", "+0.5 Paperwork Per Second", "paperworkPrimary", function(num) {return {"effort": 0,"paperwork": (0.5 + flags.flag("sharpenedPencil") + flags.flag("mechanicalpencil")) * num,"yessir": 0};}, false);
	addPowerUp("pen", {effort: 0, paperwork: 900, yessir: 0}, "Pen", "+3 Paperwork Per Second", "paperworkPrimary", function(num) {return {"effort": 0,"paperwork": (3 + flags.flag("moreink") + flags.flag("cyberpen")) * num,"yessir": 0};}, false);
	addPowerUp("typewriter", {effort: 0, paperwork: 25437, yessir: 0}, "Typewriter", "+50 Paperwork Per Second", "paperworkPrimary", function(num) {return {"effort": 0,"paperwork": (50 + flags.flag("wordprocessor") + flags.flag("talktotext")) * num,"yessir": 0};}, false);
	addPowerUp("printer", {effort: 540000, paperwork: 150000, yessir: 0}, "Printer", "+300 Paperwork Per Second", "paperworkPrimary", function(num) {return {"effort": 0,"paperwork": (300 + flags.flag("laserprinter") + flags.flag("threeinone")) * num,"yessir": 0};}, false);
	addPowerUp("altavista", {effort: 4850000, paperwork: 314159, yessir: 0}, "Email Address", "+2400 Paperwork Per Second", "paperworkPrimary", function(num) {return {"effort": 0,"paperwork": (2400 + flags.flag("lycos") + flags.flag("compuserve")) * num,"yessir": 0};}, false);
	addPowerUp("orphans", {effort: 25600000, paperwork: 1000000, yessir: 80000}, "Flock of orphans with your handwriting", "+9999 Paperwork Per Second", "paperworkPrimary", function(num) {return {"effort": 0,"paperwork": (9999 + flags.flag("gruel") + flags.flag("posters")) * num,"yessir": 0};}, false);
	addPowerUp("robots", {effort: 101200000, paperwork: 11235813, yessir: 670000}, "Robots. God damned robots.", "+70000 Paperwork Per Second", "paperworkPrimary", function(num) {return {"effort": 0,"paperwork": (70000 + flags.flag("laserguns") + flags.flag("sentience")) * num,"yessir": 0};}, false);
	addPowerUp("unicron", {effort: 155848000, paperwork: 81000000, yessir: 1599000}, "Living planet with amazing handwriting", "+500000 Paperwork Per Second", "paperworkPrimary", function(num) {return {"effort": 0,"paperwork": (500000 + flags.flag("matrix") + flags.flag("disc")) * num,"yessir": 0};}, false);
	addPowerUp("tippiecanoe", {effort: 0, paperwork: 0, yessir: 15}, "\"Tippecanoe and Tyler Too!\"", "+0.1 Yes Sir Per Second", "yessirPrimary", function(num) {return {"effort": 0,"paperwork": 0,"yessir": (0.1 + flags.flag("tyler") + flags.flag("harrison")) * num};}, false);
	addPowerUp("harry", {effort: 0, paperwork: 0, yessir: 100}, "\"Give 'Em Hell, Harry!\"", "+0.5 Yes Sir Per Second", "yessirPrimary", function(num) {return {"effort": 0,"paperwork": 0,"yessir": (0.5 + flags.flag("barkley") + flags.flag("truman")) * num};}, false);
	addPowerUp("ike", {effort: 0, paperwork: 0, yessir: 900}, "\"I Like Ike!\"", "+3 Yes Sir Per Second", "yessirPrimary", function(num) {return {"effort": 0,"paperwork": 0,"yessir": (3 + flags.flag("nixon") + flags.flag("eisenhower")) * num};}, false);
	addPowerUp("great", {effort: 0, paperwork: 0, yessir: 25437}, "\"A Time For Greatness\"", "+50 Yes Sir Per Second", "yessirPrimary", function(num) {return {"effort": 0,"paperwork": 0,"yessir": (50 + flags.flag("johnson") + flags.flag("kennedy")) * num};}, false);
	addPowerUp("taxes", {effort: 9110000, paperwork: 647000, yessir: 150000}, "\"No New Taxes\"", "+300 Yes Sir Per Second", "yessirPrimary", function(num) {return {"effort": 0,"paperwork": 0,"yessir": (300 + flags.flag("quayle") + flags.flag("bush")) * num};}, false);
	addPowerUp("timeforchange", {effort: 44400000, paperwork: 1234567, yessir: 314159}, "\"It's Time To Change America\"", "+2400 Yes Sir Per Second", "yessirPrimary", function(num) {return {"effort": 0,"paperwork": 0,"yessir": (2400 + flags.flag("gore") + flags.flag("clinton")) * num};}, false);
	addPowerUp("change", {effort: 322222222, paperwork: 12345678, yessir: 1000000}, "\"Change\"", "+9999 Yes Sir Per Second", "yessirPrimary", function(num) {return {"effort": 0,"paperwork": 0,"yessir": (9999 + flags.flag("biden") + flags.flag("obama")) * num};}, false);
	addPowerUp("handsacrossamerica", {effort: 5000000000, paperwork: 123456789, yessir: 11235813}, "\"Free Sexual Favors For Everyone!\"", "+70000 Yes Sir Per Second", "yessirPrimary", function(num) {return {"effort": 0,"paperwork": 0,"yessir": (70000 + flags.flag("morelube") + flags.flag("chickenmeanscock")) * num};}, false);
	addPowerUp("morelies", {effort: 8500000000, paperwork: 370370367, yessir: 134829756}, "\"Here, Have Some Empty Promises\"", "+500000 Yes Sir Per Second", "yessirPrimary", function(num) {return {"effort": 0,"paperwork": 0,"yessir": (500000 + flags.flag("jobs") + flags.flag("hungryhungry")) * num};}, false);
	addPowerUp("perfectstrangers", {effort: 500, paperwork: 0, yessir: 0}, "Perfect Strangers", "+2 Effort For Every Stranger", "effortSecondary", function(num) { if( $("#perfectstrangers").length > 0 && num > 0) {$("#perfectstrangers").remove();}flags.flag("perfectstrangers", 2); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("perfectstrangers", 0);});
	addPowerUp("perfectstrangers2", {effort: 45000, paperwork: 0, yessir: 0}, "Perfect Strangers Mk. II", "+50 Effort For Every Stranger", "effortSecondary", function(num) { if( $("#perfectstrangers2").length > 0 && num > 0) {$("#perfectstrangers2").remove();}flags.flag("perfectstrangers2", 50); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("perfectstrangers2", 0);});
	addPowerUp("gettingtoknowyou", {effort: 7600, paperwork: 0, yessir: 0}, "Getting To Know You", "+5 Effort For Every Acquaintance", "effortSecondary", function(num) { if( $("#gettingtoknowyou").length > 0 && num > 0) {$("#gettingtoknowyou").remove();}flags.flag("gettingtoknowyou", 5); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("gettingtoknowyou", 0);});
	addPowerUp("gettingtoknowallaboutyou", {effort: 620000, paperwork: 0, yessir: 0}, "Getting To Know All About You", "+70 Effort For Every Acquaintance", "effortSecondary", function(num) { if( $("#gettingtoknowallaboutyou").length > 0 && num > 0) {$("#gettingtoknowallaboutyou").remove();}flags.flag("gettingtoknowallaboutyou", 70); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("gettingtoknowallaboutyou", 0);});
	addPowerUp("joey", {effort: 50000, paperwork: 0, yessir: 0}, "Joey", "+10 Effort For Every Friend", "effortSecondary", function(num) { if( $("#joey").length > 0 && num > 0) {$("#joey").remove();}flags.flag("joey", 10); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("joey", 0);});
	addPowerUp("chandler", {effort: 222000, paperwork: 0, yessir: 0}, "Chandler", "+115 Effort For Every Friend", "effortSecondary", function(num) { if( $("#chandler").length > 0 && num > 0) {$("#chandler").remove();}flags.flag("chandler", 115); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("chandler", 0);});
	addPowerUp("budlight", {effort: 920000, paperwork: 0, yessir: 0}, "Bud Light", "+115 Effort For Every Bro", "effortSecondary", function(num) { if( $("#budlight").length > 0 && num > 0) {$("#budlight").remove();}flags.flag("budlight", 115); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("budlight", 0);});
	addPowerUp("collar", {effort: 3200000, paperwork: 0, yessir: 0}, "Popped Collar", "+420 Effort For Every Bro", "effortSecondary", function(num) { if( $("#collar").length > 0 && num > 0) {$("#collar").remove();}flags.flag("collar", 420); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("collar", 0);});
	addPowerUp("pizza", {effort: 720000, paperwork: 42000, yessir: 0}, "Pizza", "+500 Effort For Every Best Friend", "effortSecondary", function(num) { if( $("#pizza").length > 0 && num > 0) {$("#pizza").remove();}flags.flag("pizza", 500); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("pizza", 0);});
	addPowerUp("hideabody", {effort: 3200000, paperwork: 118000, yessir: 0}, "Hide A Body Maybe?", "+900 Effort For Every Best Friend", "effortSecondary", function(num) { if( $("#hideabody").length > 0 && num > 0) {$("#hideabody").remove();}flags.flag("hideabody", 900); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("hideabody", 0);});
	addPowerUp("idkmbffj", {effort: 1120000, paperwork: 77777, yessir: 0}, "IDK, my BFF Jill?", "+1234 Effort For Every BFF", "effortSecondary", function(num) { if( $("#idkmbffj").length > 0 && num > 0) {$("#idkmbffj").remove();}flags.flag("idkmbffj", 1234); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("idkmbffj", 0);});
	addPowerUp("instantgram", {effort: 9876543, paperwork: 300000, yessir: 0}, "Instant Gram (That's What The Kids Call It?)", "+5000 Effort For Every BFF", "effortSecondary", function(num) { if( $("#instantgram").length > 0 && num > 0) {$("#instantgram").remove();}flags.flag("instantgram", 5000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("instantgram", 0);});
	addPowerUp("objection", {effort: 4810000, paperwork: 1475000, yessir: 49000}, "OBJECTION!", "+25000 Effort For Every Personal Lawyer", "effortSecondary", function(num) { if( $("#objection").length > 0 && num > 0) {$("#objection").remove();}flags.flag("objection", 25000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("objection", 0);});
	addPowerUp("takethat", {effort: 10240000, paperwork: 6675000, yessir: 260000}, "TAKE THAT!!", "+50000 Effort For Every Personal Lawyer", "effortSecondary", function(num) { if( $("#takethat").length > 0 && num > 0) {$("#takethat").remove();}flags.flag("takethat", 50000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("takethat", 0);});
	addPowerUp("cohabitate", {effort: 21345589, paperwork: 9999990, yessir: 679000}, "Move In Together", "+150000 Effort For Every Significant Other", "effortSecondary", function(num) { if( $("#cohabitate").length > 0 && num > 0) {$("#cohabitate").remove();}flags.flag("cohabitate", 150000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("cohabitate", 0);});
	addPowerUp("cosign", {effort: 144233377, paperwork: 50000000, yessir: 4110000}, "Buy A House!", "+300000 Effort For Every Significant Other", "effortSecondary", function(num) { if( $("#cosign").length > 0 && num > 0) {$("#cosign").remove();}flags.flag("cosign", 300000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("cosign", 0);});
	addPowerUp("babypac", {effort: 231777551, paperwork: 32000000, yessir: 1241100}, "Baby PAC", "+1750000 Effort For Every Super PAC", "effortSecondary", function(num) { if( $("#babypac").length > 0 && num > 0) {$("#babypac").remove();}flags.flag("babypac", 1750000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("babypac", 0);});
	addPowerUp("mspac", {effort: 1557773120, paperwork: 68800000, yessir: 9000000}, "Ms. PAC", "+5000000 Effort For Every Super PAC", "effortSecondary", function(num) { if( $("#mspac").length > 0 && num > 0) {$("#mspac").remove();}flags.flag("mspac", 5000000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("mspac", 0);});
	addPowerUp("paperclips", {effort: 0, paperwork: 500, yessir: 0}, "Paperclips", "+2 Paperwork For Every Staples", "paperworkSecondary", function(num) { if( $("#paperclips").length > 0 && num > 0) {$("#paperclips").remove();}flags.flag("paperclips", 2); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("paperclips", 0);});
	addPowerUp("paperbinders", {effort: 0, paperwork: 45000, yessir: 0}, "Paper Binders", "+50 Paperwork For Every Staples", "paperworkSecondary", function(num) { if( $("#paperbinders").length > 0 && num > 0) {$("#paperbinders").remove();}flags.flag("paperbinders", 50); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("paperbinders", 0);});
	addPowerUp("sharpenedPencil", {effort: 0, paperwork: 7600, yessir: 0}, "Sharpened Pencil", "+5 Paperwork For Every Pencil", "paperworkSecondary", function(num) { if( $("#sharpenedPencil").length > 0 && num > 0) {$("#sharpenedPencil").remove();}flags.flag("sharpenedPencil", 5); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("sharpenedPencil", 0);});
	addPowerUp("mechanicalpencil", {effort: 0, paperwork: 620000, yessir: 0}, "Mechanical Pencil", "+70 Paperwork For Every Pencil", "paperworkSecondary", function(num) { if( $("#mechanicalpencil").length > 0 && num > 0) {$("#mechanicalpencil").remove();}flags.flag("mechanicalpencil", 70); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("mechanicalpencil", 0);});
	addPowerUp("moreink", {effort: 0, paperwork: 50000, yessir: 0}, "MORE. INK.", "+10 Paperwork For Every Pen", "paperworkSecondary", function(num) { if( $("#moreink").length > 0 && num > 0) {$("#moreink").remove();}flags.flag("moreink", 10); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("moreink", 0);});
	addPowerUp("cyberpen", {effort: 0, paperwork: 222000, yessir: 0}, "Cybernetic Pen", "+115 Paperwork For Every Pen", "paperworkSecondary", function(num) { if( $("#cyberpen").length > 0 && num > 0) {$("#cyberpen").remove();}flags.flag("cyberpen", 115); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("cyberpen", 0);});
	addPowerUp("wordprocessor", {effort: 0, paperwork: 920000, yessir: 0}, "Word Processor", "+115 Paperwork For Every Typewriter", "paperworkSecondary", function(num) { if( $("#wordprocessor").length > 0 && num > 0) {$("#wordprocessor").remove();}flags.flag("wordprocessor", 115); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("wordprocessor", 0);});
	addPowerUp("talktotext", {effort: 0, paperwork: 3200000, yessir: 0}, "Talk To Text", "+420 Paperwork For Every Typewriter", "paperworkSecondary", function(num) { if( $("#talktotext").length > 0 && num > 0) {$("#talktotext").remove();}flags.flag("talktotext", 420); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("talktotext", 0);});
	addPowerUp("laserprinter", {effort: 3110000, paperwork: 720000, yessir: 0}, "Laser Printer", "+500 Paperwork For Every Printer", "paperworkSecondary", function(num) { if( $("#laserprinter").length > 0 && num > 0) {$("#laserprinter").remove();}flags.flag("laserprinter", 500); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("laserprinter", 0);});
	addPowerUp("threeinone", {effort: 8240000, paperwork: 3200000, yessir: 0}, "Three In One Printer", "+900 Paperwork For Every Printer", "paperworkSecondary", function(num) { if( $("#threeinone").length > 0 && num > 0) {$("#threeinone").remove();}flags.flag("threeinone", 900); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("threeinone", 0);});
	addPowerUp("lycos", {effort: 5120000, paperwork: 1120000, yessir: 0}, "Lycos", "+1234 Paperwork For Every Email Address", "paperworkSecondary", function(num) { if( $("#lycos").length > 0 && num > 0) {$("#lycos").remove();}flags.flag("lycos", 1234); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("lycos", 0);});
	addPowerUp("compuserve", {effort: 42420000, paperwork: 9876543, yessir: 0}, "CompuServe", "+5000 Paperwork For Every Email Address", "paperworkSecondary", function(num) { if( $("#compuserve").length > 0 && num > 0) {$("#compuserve").remove();}flags.flag("compuserve", 5000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("compuserve", 0);});
	addPowerUp("gruel", {effort: 16140000, paperwork: 4810000, yessir: 721000}, "Bowls Of Gruel", "+25000 Paperwork For Every Flock of orphans with your handwriting", "paperworkSecondary", function(num) { if( $("#gruel").length > 0 && num > 0) {$("#gruel").remove();}flags.flag("gruel", 25000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("gruel", 0);});
	addPowerUp("posters", {effort: 616100000, paperwork: 10240000, yessir: 3210000}, "Motivational Posters!", "+50000 Paperwork For Every Flock of orphans with your handwriting", "paperworkSecondary", function(num) { if( $("#posters").length > 0 && num > 0) {$("#posters").remove();}flags.flag("posters", 50000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("posters", 0);});
	addPowerUp("laserguns", {effort: 397110000, paperwork: 21345589, yessir: 679000}, "Laser Guns", "+150000 Paperwork For Every Robots. God damned robots.", "paperworkSecondary", function(num) { if( $("#laserguns").length > 0 && num > 0) {$("#laserguns").remove();}flags.flag("laserguns", 150000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("laserguns", 0);});
	addPowerUp("sentience", {effort: 1337000000, paperwork: 144233377, yessir: 4110000}, "Sentience", "+300000 Paperwork For Every Robots. God damned robots.", "paperworkSecondary", function(num) { if( $("#sentience").length > 0 && num > 0) {$("#sentience").remove();}flags.flag("sentience", 300000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("sentience", 0);});
	addPowerUp("matrix", {effort: 794220000, paperwork: 64036767, yessir: 2716000}, "Matrix of...Eh.", "+1750000 Paperwork For Every Living planet with amazing handwriting", "paperworkSecondary", function(num) { if( $("#matrix").length > 0 && num > 0) {$("#matrix").remove();}flags.flag("matrix", 1750000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("matrix", 0);});
	addPowerUp("disc", {effort: 1588440000, paperwork: 177407054, yessir: 5432000}, "Silver Disc", "+5000000 Paperwork For Every Living planet with amazing handwriting", "paperworkSecondary", function(num) { if( $("#disc").length > 0 && num > 0) {$("#disc").remove();}flags.flag("disc", 5000000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("disc", 0);});
	addPowerUp("tyler", {effort: 0, paperwork: 0, yessir: 500}, "John Tyler", "+2 Yes Sir For Every \"Tippecanoe and Tyler Too!\"", "yessirSecondary", function(num) { if( $("#tyler").length > 0 && num > 0) {$("#tyler").remove();}flags.flag("tyler", 2); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("tyler", 0);});
	addPowerUp("harrison", {effort: 0, paperwork: 0, yessir: 45000}, "William Henry Harrison", "+50 Yes Sir For Every \"Tippecanoe and Tyler Too!\"", "yessirSecondary", function(num) { if( $("#harrison").length > 0 && num > 0) {$("#harrison").remove();}flags.flag("harrison", 50); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("harrison", 0);});
	addPowerUp("barkley", {effort: 0, paperwork: 0, yessir: 7600}, "Alben W. Barkley", "+5 Yes Sir For Every \"Give 'Em Hell, Harry!\"", "yessirSecondary", function(num) { if( $("#barkley").length > 0 && num > 0) {$("#barkley").remove();}flags.flag("barkley", 5); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("barkley", 0);});
	addPowerUp("truman", {effort: 0, paperwork: 0, yessir: 620000}, "Harry S. Truman", "+70 Yes Sir For Every \"Give 'Em Hell, Harry!\"", "yessirSecondary", function(num) { if( $("#truman").length > 0 && num > 0) {$("#truman").remove();}flags.flag("truman", 70); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("truman", 0);});
	addPowerUp("nixon", {effort: 0, paperwork: 0, yessir: 50000}, "Richard Nixon", "+10 Yes Sir For Every \"I Like Ike!\"", "yessirSecondary", function(num) { if( $("#nixon").length > 0 && num > 0) {$("#nixon").remove();}flags.flag("nixon", 10); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("nixon", 0);});
	addPowerUp("eisenhower", {effort: 0, paperwork: 0, yessir: 222000}, "Dwight D. Eisenhower", "+115 Yes Sir For Every \"I Like Ike!\"", "yessirSecondary", function(num) { if( $("#eisenhower").length > 0 && num > 0) {$("#eisenhower").remove();}flags.flag("eisenhower", 115); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("eisenhower", 0);});
	addPowerUp("johnson", {effort: 0, paperwork: 0, yessir: 920000}, "Lyndon B. Johnson", "+115 Yes Sir For Every \"A Time For Greatness\"", "yessirSecondary", function(num) { if( $("#johnson").length > 0 && num > 0) {$("#johnson").remove();}flags.flag("johnson", 115); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("johnson", 0);});
	addPowerUp("kennedy", {effort: 0, paperwork: 0, yessir: 3200000}, "John F. Kennedy", "+420 Yes Sir For Every \"A Time For Greatness\"", "yessirSecondary", function(num) { if( $("#kennedy").length > 0 && num > 0) {$("#kennedy").remove();}flags.flag("kennedy", 420); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("kennedy", 0);});
	addPowerUp("quayle", {effort: 18660000, paperwork: 18660000, yessir: 18660000}, "Dan Quayle", "+500 Yes Sir For Every \"No New Taxes\"", "yessirSecondary", function(num) { if( $("#quayle").length > 0 && num > 0) {$("#quayle").remove();}flags.flag("quayle", 500); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("quayle", 0);});
	addPowerUp("bush", {effort: 49440000, paperwork: 49440000, yessir: 49440000}, "George H. W. Bush", "+900 Yes Sir For Every \"No New Taxes\"", "yessirSecondary", function(num) { if( $("#bush").length > 0 && num > 0) {$("#bush").remove();}flags.flag("bush", 900); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("bush", 0);});
	addPowerUp("gore", {effort: 30720000, paperwork: 30720000, yessir: 30720000}, "Al Gore", "+1234 Yes Sir For Every \"It's Time To Change America\"", "yessirSecondary", function(num) { if( $("#gore").length > 0 && num > 0) {$("#gore").remove();}flags.flag("gore", 1234); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("gore", 0);});
	addPowerUp("clinton", {effort: 254520000, paperwork: 254520000, yessir: 254520000}, "Bill Clinton", "+5000 Yes Sir For Every \"It's Time To Change America\"", "yessirSecondary", function(num) { if( $("#clinton").length > 0 && num > 0) {$("#clinton").remove();}flags.flag("clinton", 5000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("clinton", 0);});
	addPowerUp("biden", {effort: 96840000, paperwork: 96840000, yessir: 96840000}, "Joe Biden", "+25000 Yes Sir For Every \"Change\"", "yessirSecondary", function(num) { if( $("#biden").length > 0 && num > 0) {$("#biden").remove();}flags.flag("biden", 25000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("biden", 0);});
	addPowerUp("obama", {effort: 3696600000, paperwork: 3696600000, yessir: 3696600000}, "Barack Obama", "+50000 Yes Sir For Every \"Change\"", "yessirSecondary", function(num) { if( $("#obama").length > 0 && num > 0) {$("#obama").remove();}flags.flag("obama", 50000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("obama", 0);});
	addPowerUp("morelube", {effort: 2382660000, paperwork: 2382660000, yessir: 2382660000}, "More Lube", "+150000 Yes Sir For Every \"Free Sexual Favors For Everyone!\"", "yessirSecondary", function(num) { if( $("#morelube").length > 0 && num > 0) {$("#morelube").remove();}flags.flag("morelube", 150000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("morelube", 0);});
	addPowerUp("chickenmeanscock", {effort: 8022000000, paperwork: 8022000000, yessir: 8022000000}, "A \"Chicken\" In Every \"Pot\"", "+300000 Yes Sir For Every \"Free Sexual Favors For Everyone!\"", "yessirSecondary", function(num) { if( $("#chickenmeanscock").length > 0 && num > 0) {$("#chickenmeanscock").remove();}flags.flag("chickenmeanscock", 300000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("chickenmeanscock", 0);});
	addPowerUp("jobs", {effort: 4765320000, paperwork: 4765320000, yessir: 4765320000}, "\"Jobs For Everyone, For Real!\"", "+1750000 Yes Sir For Every \"Here, Have Some Empty Promises\"", "yessirSecondary", function(num) { if( $("#jobs").length > 0 && num > 0) {$("#jobs").remove();}flags.flag("jobs", 1750000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("jobs", 0);});
	addPowerUp("hungryhungry", {effort: 9530640000, paperwork: 9530640000, yessir: 9530640000}, "\"I Will End World Hunger Forever.\"", "+5000000 Yes Sir For Every \"Here, Have Some Empty Promises\"", "yessirSecondary", function(num) { if( $("#hungryhungry").length > 0 && num > 0) {$("#hungryhungry").remove();}flags.flag("hungryhungry", 5000000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("hungryhungry", 0);});
	addPowerUp("grindstone", {effort: 1100, paperwork: 0, yessir: 0}, "Nose To The Grindstone", "+5 Effort For Every Click", "effortTertiary", function(num) { if( $("#grindstone").length > 0 && num > 0) {$("#grindstone").remove();} flags.flag("grindstone", 5); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("grindstone", 0);});
	addPowerUp("back", {effort: 21000, paperwork: 0, yessir: 0}, "Put Your Back Into It", "+75 Effort For Every Click", "effortTertiary", function(num) { if( $("#back").length > 0 && num > 0) {$("#back").remove();} flags.flag("back", 75); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("back", 0);});
	addPowerUp("pain", {effort: 480000, paperwork: 0, yessir: 0}, "No Pain, No Gain", "+500 Effort For Every Click", "effortTertiary", function(num) { if( $("#pain").length > 0 && num > 0) {$("#pain").remove();} flags.flag("pain", 500); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("pain", 0);});
	addPowerUp("mile", {effort: 3456000, paperwork: 0, yessir: 0}, "Go The Extra Mile", "+2500 Effort For Every Click", "effortTertiary", function(num) { if( $("#mile").length > 0 && num > 0) {$("#mile").remove();} flags.flag("mile", 2500); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("mile", 0);});
	addPowerUp("believe", {effort: 9999990, paperwork: 0, yessir: 0}, "Believe In Yourself", "+30000 Effort For Every Click", "effortTertiary", function(num) { if( $("#believe").length > 0 && num > 0) {$("#believe").remove();} flags.flag("believe", 30000); return {"effort": 0,"paperwork": 0,"yessir": 0};}, true, function() { flags.flag("believe", 0);});	

	var flags = {
		list: {},
		resetAll: function() {
			for(var i in this.list) {
				this.list[i] = 0;
			}
		},
		flag:	function(id, val) {
			if(val && val !== "") {
				this.list[id] = val;
			}
			return this.list[id] || 0;
		}
	}
	
	flags.flag("multiplier", 1);	//This is not the greatest variable in the code. No. This is just a tribute.
	
	Game.listPowerUp = function(id) {
		if($("#" + id).length === 0) {
			var func = powerupsfuncs[id];
			var target = $("#" + func["section"]);
			var li = $("<li>");
			li.attr("id", id);
			li.html(func["label"]);
			target.append(li);
			var q = $("<q>");
			var html = "";
			html += (func["cost"].effort !== 0 ? "Effort: " + numberWithCommas(Game.compInt(func["cost"].effort, powerups[id]).toFixed(0)) : "") + " ";
			html += (func["cost"].paperwork !== 0 ? "Paperwork: " + numberWithCommas(Game.compInt(func["cost"].paperwork, powerups[id]).toFixed(0)) : "") + " ";
			html += (func["cost"].yessir !== 0 ? "Yes Sir: " + numberWithCommas(Game.compInt(func["cost"].yessir, powerups[id]).toFixed(0)) : "");
			q.html(html);
			q.attr("id", id + "_q");
			li.append(q);
			var pre = $("<pre>");
			pre.attr("id", id + "_pre");
			pre.html("" + powerups[id]);
			li.append(pre);
			/*
			You know what? As of 11/14/13, 9:54PM:
			
			I don't like selling.
			
			Seems to be a moot point, if you ask me. And if you're asking me while reading comments, then STOP PROJECTING YOUR THOUGHTS INTO MY HEAD
			
			var sell = $("<a href=\"javascript:void(0)\">Sell</a>");
			sell.attr("myPow", id);
			sell.css({"position": "absolute", "top": "3px", "right": "3px"});
			li.append(sell);
			sell.click(function(e) {
				e.stopPropagation();
				var id = $(this).attr("myPow");
				if(powerups[id] > 0) {
					powerups[id]--;
					var effortVal = Game.compInt(func["cost"].effort, powerups[id]), paperworkVal = Game.compInt(func["cost"].paperwork, powerups[id]), yessirVal = Game.compInt(func["cost"].yessir, powerups[id]);
					efforttally += (effortVal * 0.5);
					paperworktally += (paperworkVal * 0.5);
					yessirtally  += (yessirVal * 0.5);
					var q = $("#" + id + "_q");
					var html = "";
					html += (func["cost"].effort !== 0 ? "Effort: " + numberWithCommas(Game.compInt(func["cost"].effort, powerups[id]).toFixed(0)) : "") + " ";
					html += (func["cost"].paperwork !== 0 ? "Paperwork: " + numberWithCommas(Game.compInt(func["cost"].paperwork, powerups[id]).toFixed(0)) : "") + " ";
					html += (func["cost"].yessir !== 0 ? "Yes Sir: " + numberWithCommas(Game.compInt(func["cost"].yessir, powerups[id]).toFixed(0)) : "");
					
					q.html(html);
					var pre = $("#" + id + "_pre");
					pre.html("Total: " + powerups[id]);
					if(func["sell"] !== null) func["sell"]();
				}
			});*/
			li.click(function(goal, id) {
				return function() {
					var effortVal = Game.compInt(func["cost"].effort, powerups[id]), paperworkVal = Game.compInt(func["cost"].paperwork, powerups[id]), yessirVal = Game.compInt(func["cost"].yessir, powerups[id]);
					if(efforttally >= effortVal &&
						paperworktally >= paperworkVal &&
						yessirtally >= yessirVal) {
							if(func["onetime"] === true && powerups[id] > 0) return;
							powerups[id]++;
							efforttally -= effortVal;
							paperworktally -= paperworkVal;
							yessirtally -= yessirVal;
							var q = $("#" + id + "_q");
							var html = "";
							html += (func["cost"].effort !== 0 ? "Effort: " + numberWithCommas(Game.compInt(func["cost"].effort, powerups[id]).toFixed(0)) : "") + " ";
							html += (func["cost"].paperwork !== 0 ? "Paperwork: " + numberWithCommas(Game.compInt(func["cost"].paperwork, powerups[id]).toFixed(0)) : "") + " ";
							html += (func["cost"].yessir !== 0 ? "Yes Sir: " + numberWithCommas(Game.compInt(func["cost"].yessir, powerups[id]).toFixed(0)) : "");
							q.html(html);
							var pre = $("#" + id + "_pre");
							pre.html("" + powerups[id]);
							Game.recalculate();
					}
				}
			}(func, id));
			var label = $("<span>");
			label.html(func["description"]);
			label.css({"position": "absolute", "right": "3px", "top": "3px", "font-size": "10px"});
			li.append(label);
			//li.tooltip({track: true});
		}
	}
	var buildPows = function() {
		var targs = ["#effortPrimary","#effortSecondary","#effortTertiary",
			"#paperworkPrimary","#paperworkSecondary","#paperworkTertiary",
			"#yessirPrimary","#yessirSecondary","#yessirTertiary"].join(",");
		$(targs).empty();
		Game.listPowerUp("grindstone");	Game.listPowerUp("back");	Game.listPowerUp("pain");	Game.listPowerUp("mile");	Game.listPowerUp("believe");
		Game.listPowerUp("stranger");	Game.listPowerUp("perfectstrangers");	Game.listPowerUp("perfectstrangers2");		
		Game.listPowerUp("acquaintance");	Game.listPowerUp("gettingtoknowyou");	Game.listPowerUp("gettingtoknowallaboutyou");		
		Game.listPowerUp("friend");	Game.listPowerUp("joey");	Game.listPowerUp("chandler");		
		Game.listPowerUp("bro");	Game.listPowerUp("budlight");	Game.listPowerUp("collar");		
		Game.listPowerUp("bestfriend");	Game.listPowerUp("pizza");	Game.listPowerUp("hideabody");		
		Game.listPowerUp("bff");	Game.listPowerUp("idkmbffj");	Game.listPowerUp("instantgram");		
		Game.listPowerUp("personallawyer");	Game.listPowerUp("objection");	Game.listPowerUp("takethat");		
		Game.listPowerUp("sigother");	Game.listPowerUp("cohabitate");	Game.listPowerUp("cosign");		
		Game.listPowerUp("superpac");	Game.listPowerUp("babypac");	Game.listPowerUp("mspac");		
		Game.listPowerUp("staples");	Game.listPowerUp("paperclips");	Game.listPowerUp("paperbinders");		
		Game.listPowerUp("pencil");	Game.listPowerUp("sharpenedPencil");	Game.listPowerUp("mechanicalpencil");		
		Game.listPowerUp("pen");	Game.listPowerUp("moreink");	Game.listPowerUp("cyberpen");		
		Game.listPowerUp("typewriter");	Game.listPowerUp("wordprocessor");	Game.listPowerUp("talktotext");		
		Game.listPowerUp("printer");	Game.listPowerUp("laserprinter");	Game.listPowerUp("threeinone");		
		Game.listPowerUp("altavista");	Game.listPowerUp("lycos");	Game.listPowerUp("compuserve");		
		Game.listPowerUp("orphans");	Game.listPowerUp("gruel");	Game.listPowerUp("posters");		
		Game.listPowerUp("robots");	Game.listPowerUp("laserguns");	Game.listPowerUp("sentience");		
		Game.listPowerUp("unicron");	Game.listPowerUp("matrix");	Game.listPowerUp("disc");		
		Game.listPowerUp("tippiecanoe");	Game.listPowerUp("tyler");	Game.listPowerUp("harrison");		
		Game.listPowerUp("harry");	Game.listPowerUp("barkley");	Game.listPowerUp("truman");		
		Game.listPowerUp("ike");	Game.listPowerUp("nixon");	Game.listPowerUp("eisenhower");		
		Game.listPowerUp("great");	Game.listPowerUp("johnson");	Game.listPowerUp("kennedy");		
		Game.listPowerUp("taxes");	Game.listPowerUp("quayle");	Game.listPowerUp("bush");		
		Game.listPowerUp("timeforchange");	Game.listPowerUp("gore");	Game.listPowerUp("clinton");		
		Game.listPowerUp("change");	Game.listPowerUp("biden");	Game.listPowerUp("obama");		
		Game.listPowerUp("handsacrossamerica");	Game.listPowerUp("morelube");	Game.listPowerUp("chickenmeanscock");		
		Game.listPowerUp("morelies");	Game.listPowerUp("jobs");	Game.listPowerUp("hungryhungry");		
	}
	buildPows();
	
	Game.Load = function() {
		try {
			if(localStorage["efforttally"] && localStorage["efforttally"] !== "") {
				efforttally = Math.round(parseFloat(localStorage["efforttally"]));
				paperworktally = Math.round(parseFloat(localStorage["paperworktally"]));
				yessirtally = Math.round(parseFloat(localStorage["yessirtally"]));
				currentGoalIndex = Math.round(parseFloat(localStorage["currentGoalIndex"]));
				totalRestart = Math.round(parseFloat(localStorage["totalRestart"]));
				for(var i in powerups) {
					if(localStorage[i]) powerups[i] = Math.round(parseFloat(localStorage[i]));
				}
				$("#autogoal").prop("checked", localStorage["autogoal"] === "true");
				totalEffortClicks = Math.round(parseFloat(localStorage["totalEffortClicks"]));
				totalEffortGained = Math.round(parseFloat(localStorage["totalEffortGained"]));
				totalPaperworkWiggles = Math.round(parseFloat(localStorage["totalPaperworkWiggles"]));
				totalYessirScrolls = Math.round(parseFloat(localStorage["totalYessirScrolls"]));
				totalRestart = isNaN(totalRestart) ? 0 : totalRestart;
				totalEffortClicks = isNaN(totalEffortClicks) ? 0 : totalEffortClicks;
				totalEffortGained = isNaN(totalEffortGained) ? 0 : totalEffortGained;
				totalPaperworkWiggles = isNaN(totalPaperworkWiggles) ? 0 : totalPaperworkWiggles;
				totalYessirScrolls = isNaN(totalYessirScrolls) ? 0 : totalYessirScrolls;
				
				startDate = Math.round(parseFloat(localStorage["startDate"]));
				randomSpawn();
			}
			else {
				randomCreate("firstone");	//Yep. First one's free.
			}
		}
		catch(e) {
		}
	}
	
	Game.Export = function() {
		try {
			var s = "";
			
			for(var i in localStorage) {
				s += i + "{;}" + localStorage[i] + "{!}";
			}
			
			prompt("Please copy and paste the below text", s);
		}
		catch(e) {
		}
	}
	
	Game.Import = function() {
		try {
			var s = prompt("Please paste your exported data below and click OK", "");
			
			if(s && s !== "" && s.split("{!}").length > 1) {
				var objs = s.split("{!}");
				for(var i = 0;i<objs.length;i++) {
					var obj = objs[i];
					if(obj.split("{;}").length > 1) {
						var key = obj.split("{;}")[0];
						var val = obj.split("{;}")[1];
						if(val === "true" || val === "false") localStorage[key] = Boolean(val);
						else localStorage[key] = Math.round(parseFloat(val));
					}
				}
				Game.Load();
				Game.updatePastGoals();
				Game.updateCurrentGoals();
			}
			else return alert("Invalid save data");
			
		}
		catch(e) {
		}
	}
	
	Game.Save = function() {
		/*
			OK, let's declare the variables we NEED to save:
			powerups
			efforttally
			paperworktally
			yessirtally
			currentGoalIndex
		*/
		try {
			for(var i in powerups) {
				localStorage[i] = powerups[i];
			}
			localStorage["efforttally"] = Math.round(efforttally);
			localStorage["paperworktally"] = Math.round(paperworktally);
			localStorage["yessirtally"] = Math.round(yessirtally);
			localStorage["currentGoalIndex"] = currentGoalIndex;
			localStorage["autogoal"] = autogoal;
			localStorage["totalEffortClicks"] = totalEffortClicks;
			localStorage["totalEffortGained"] = totalEffortGained;
			localStorage["totalPaperworkWiggles"] = totalPaperworkWiggles;
			localStorage["totalYessirScrolls"] = totalYessirScrolls;
			localStorage["startDate"] = startDate;
			localStorage["totalRestart"] = totalRestart;
			console.log(currentGoalIndex);
			
			Game.log("Game Saved");
			//$("#log").fadeIn(1000).delay(5000).fadeOut(1000);
		}
		catch(e) {
		}
	}
	
	Game.Reset = function() {
		for(var i in powerups) {
			powerups[i] = 0;
		}
		efforttally = 0;
		paperworktally = 0;
		yessirtally = 0;
		totalRestart += currentGoalIndex;
		currentGoalIndex = 0;
		totalEffortClicks = 0;
		totalEffortGained = 0;
		totalPaperworkWiggles = 0;
		totalYessirScrolls = 0;
		flags.resetAll();
		flags.flag("multiplier", 1);
		startDate = (new Date()).getTime()
		Game.recalculate();
		Game.resizer();
		clearTimeout(randSpawnTimer);
		$("#effortdescribe").show();
		$("#paperworkdescribe").show();
		$("#yessirdescribe").show();
		randomCreate("firstone");
		buildPows();
	}
	
	var eps = pps = yps = 0;
	Game.recalculate = function() {
		eps = pps = yps = 0;
		for(var i in powerups) {
			if(powerups[i] > 0) {
				var results = powerupsfuncs[i]["func"](powerups[i]);
				eps += results["effort"];
				pps += results["paperwork"];
				yps += results["yessir"];
			}
		}
		eps *= flags.flag("multiplier");
		pps *= flags.flag("multiplier");
		yps *= flags.flag("multiplier");
	}

	Game.Update = function() {
		var tempEff = Math.round((eps / fps) * 10000000) / 10000000;
		var tempPap = Math.round((pps / fps) * 10000000) / 10000000;
		var tempYes = Math.round((yps / fps) * 10000000) / 10000000;
		
		tempEff += (tempEff * (totalRestart / 100));
		tempPap += (tempPap * (totalRestart / 100));
		tempYes += (tempYes * (totalRestart / 100));
		Game.incrementEffort(tempEff);
		Game.incrementPaperwork(tempPap);
		Game.incrementYessir(tempYes);
		
		var goal = goals[currentGoalIndex];
		autogoal = $('#autogoal').prop('checked');
		if(autogoal === true) {
			if(efforttally >= goal.reqObj.effort &&
				paperworktally >= goal.reqObj.paperwork &&
				yessirtally >= goal.reqObj.yessir) {
					goal.unlocks();
					currentGoalIndex++;
					efforttally -= goal.reqObj.effort;
					paperworktally -= goal.reqObj.paperwork;
					yessirtally -= goal.reqObj.yessir;
					Game.addPastGoal(goal);
					Game.updateCurrentGoals();
			}
		}
	}
	Game.Draw = function() {
		for(var i in powerups) {
			if($("#" + i).length) {
				$("#" + i + "_pre").html("" + powerups[i]);
				var func = powerupsfuncs[i];
				var effortVal = Game.compInt(func["cost"].effort, powerups[i]), paperworkVal = Game.compInt(func["cost"].paperwork, powerups[i]), yessirVal = Game.compInt(func["cost"].yessir, powerups[i]);
				if(efforttally >= effortVal &&
					paperworktally >= paperworkVal &&
					yessirtally >= yessirVal) {
						$("#" + i).addClass("canPurchase").removeClass("cannotPurchase").attr("title", "Click to buy one");
				}
				else $("#" + i).removeClass("canPurchase").addClass("cannotPurchase").attr("title", "Cannot afford at this time");
				
				var q = $("#" + i + "_q");
				var html = "";
				html += (func["cost"].effort !== 0 ? "Effort: " + numberWithCommas(effortVal.toFixed(0)) : "") + " ";
				html += (func["cost"].paperwork !== 0 ? "Paperwork: " + numberWithCommas(paperworkVal.toFixed(0)) : "") + " ";
				html += (func["cost"].yessir !== 0 ? "Yes Sir: " + numberWithCommas(yessirVal.toFixed(0)) : "");
				q.html(html);
			}
		}
		$("#efforttally").html(numberWithCommas((Math.floor(efforttally * 10) / 10).toFixed(1)) + "&nbsp;Effort");
		$("#paperworktally").html(numberWithCommas((Math.floor(paperworktally * 10) / 10).toFixed(1)) + "&nbsp;Paperwork");
		$("#yessirtally").html(numberWithCommas((Math.floor(yessirtally * 10) / 10).toFixed(1)) + "&nbsp;Yes,&nbsp;Sir!");
		$("#effortpersec").html(numberWithCommas(eps.toFixed(1)) + "&nbsp;Per&nbsp;Second");
		$("#paperworkpersec").html(numberWithCommas(pps.toFixed(1)) + "&nbsp;Per&nbsp;Second");
		$("#yessirpersec").html(numberWithCommas(yps.toFixed(1)) + "&nbsp;Per&nbsp;Second");
		$("#totalEffortClicks").html(totalEffortClicks);
		$("#totalEffortGained").html(totalEffortGained);
		$("#totalPaperworkWiggles").html(totalPaperworkWiggles);
		$("#totalYessirScrolls").html(totalYessirScrolls);
		$("#totalRestart").html(totalRestart);
		$("#startDate").html((new Date(startDate)).toLocaleString());
	}
	
	Game.Loop = function() {
		Game.Update();
		missedFrames += (new Date().getTime() - lastRun) - (1000/fps);
		missedFrames = Math.min(missedFrames, 1000*5);	//admittedly, I like this logic from Cookie Clicker; catch up on up to 5 seconds worth of frame data if there is latency.
		while(missedFrames > 0) {
			Game.Update();
			missedFrames -= 1000/fps;
		}

		Game.Draw();
		//lastRun = new Date().getTime();
		//YAY THE FRAME IS DONE! Let's make sure we're staying close to our FPS goal
		//var delta = (new Date().getTime() - lastRun) / 1000;
		lastRun = new Date().getTime();
		//var currFPS = ~~(1/delta);
		//console.log(currFPS + " fps");
		//console.log(eps);
		//console.log(autogoal + " " + localStorage["autogoal"] + " " +  $('#autogoal').prop('checked'));
		setTimeout(Game.Loop, 1000/fps);	//Execute logic, then draw (i.e. update tallies) every 1000 out of (frames per second) millisecond.
	}
	
	//call the two functions below AFTER loading from localStorage
	$("#nosupport").hide();
	Game.Load();
	Game.updatePastGoals();
	Game.updateCurrentGoals();
	
	Game.buildTabs();
	
	Game.recalculate();
	
	setInterval(Game.Save, 1000*60);	//Save every 60 seconds	
	setInterval(Game.recalculate, 1000/100);	//Recalculate EPS/PPS/YPS every 1/10th of a second; it's less stress!
	
	Game.resizer();
	
	$(window).resize(function() {
		Game.resizer();
	});

	setInterval(function() {	//check for updates every 30 minutes!
		$.ajax("status.html").done(function(data) {
			if(Game.currNotes != data) {
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
		Game.currNotes = data;
	});
	
	/*setInterval(function() {	//JUST to make sure that effort is calculating correctly, as there are worries that it is not correct.
		console.log("Last Second: " + lastEffort + "      Current Second: " + efforttally + "     Difference: " + (efforttally - lastEffort));
		console.log("EPS " + eps);
		console.log("What " + (eps / fps));
		lastEffort = efforttally;
	}, 1000);
	*/
	
	//Last but not least, let's get some shit in place to track FPS, JUUUUST in case things start running slow.
	var lastRun = new Date().getTime();
	if(startDate === 0 || isNaN(startDate)) startDate = (new Date()).getTime();
	Game.Loop();
}

Game.buildTabs = function() {
	//admittedly, the code below is from http://www.jacklmoore.com/notes/jquery-tabs/
	$('.tabs').each(function(){
		// For each set of tabs, we want to keep track of
		// which tab is active and it's associated content
		var $active, $content, $links = $(this).find('a');

		// If the location.hash matches one of the links, use that as the active tab.
		// If no match is found, use the first link as the initial active tab.
		$active = $($links.filter('[href="'+location.hash+'"]')[0] || $links[0]);
		$active.addClass('active');
		$content = $($active.attr('href'));

		// Hide the remaining content
		$links.not($active).each(function () {
			$($(this).attr('href')).hide();
		});

		// Bind the click event handler
		$(this).on('click', 'a', function(e){
			// Make the old tab inactive.
			$active.removeClass('active');
			$content.hide();

			// Update the variables with the new link and content
			$active = $(this);
			$content = $($(this).attr('href'));

			// Make the tab active.
			$active.addClass('active');
			$content.show();

			// Prevent the anchor's default click action
			e.preventDefault();
		});
	});
}

Game.resizer = function() {
	var lists = {
		"#effortTarget": ["#effortPrimary","#effortSecondary","#effortTertiary"],
		"#paperworkTarget": ["#paperworkPrimary","#paperworkSecondary","#paperworkTertiary"],
		"#yessirTarget": ["#yessirPrimary","#yessirSecondary","#yessirTertiary"],
		"#pastGoalsTarget": ["#pastGoals"]
	}
	
	for(var i in lists) {
		var currList = lists[i].join(",");
		$(currList).each(function() {
			if($(this).attr("id") === "pastGoals") {
				//console.log($(this).parent().height() + " " + $("#game").height());
				$(this).css("height", ($(this).parent().height() - $(i).offset().top - $("#navbar").height()) + "px");
			}
			else $(this).css("height", ($("#game").height() - $(i).offset().top - $("#navbar").height()) + "px");
			//$(this).css("height", ($(i).parent().height() - $(i).offset().top + $("#navbar").height()) + "px");
		});
	}
}

Game.loadList = {};

Game.addLoader = function(id) {
	Game.loadList[id] = false;
}

Game.finishLoader = function(id) {
	Game.loadList[id] = true;
}

Game.checkLoad = function() {
	var loaded = true;
	var val = 0;
	var len = 0;
	for(var i in Game.loadList) {
		len++;
		if(Game.loadList[i] === false) loaded = false;
		else val++;
	}
	val = (val / len) * 100;
	document.getElementById("progress").value = val;
	$("#progressPercent").html(val.toFixed(1));
	$("#fps").html(Game.version);
	if(loaded === false) setTimeout(Game.checkLoad, 1000/fps);
	else Game.Initialize();
}

Game.preLoad = function() {
	//Function care of http://stackoverflow.com/questions/11214404/how-to-detect-if-browser-supports-html5-local-storage
	function supports_html5_storage() {
		try {
			localStorage.setItem("test", "test");
			localStorage.removeItem("test");
			return true;
		} catch (e) {
			return false;
		}
	}
	
	var canvas = document.createElement('canvas');
	
	if(!supports_html5_storage()) {
		$("#nosupport").html($("#nosupport").html() + "<br/>Your browser does not support the HTML5 functionality of \"Local Storage.\" Saving may not work for you. Please make sure you are using an up to date browser and that cookies are enabled.");
		//return;
	}
	
	if(!canvas.getContext) {
		$("#nosupport").html("Your browser does not support the HTML5 functionality of \"Canvas.\" Some images may appear weird.");
	}

	function todo(context, text, fontSize, fontColor) {
		var max_width  = 600;
		var fontSize   =  12;
		var lines      =  new Array();
		var width = 0, i, j;
		var result;
		var color = fontColor || "white";
		var font = '22px "Special Elite", cursive';
		// Font and size is required for context.measureText()
		 context.font = font

		
		// Start calculation
		while ( text.length ) {
			for( i=text.length; context.measureText(text.substr(0,i)).width > max_width; i-- );
		
			result = text.substr(0,i);
		
			if ( i !== text.length )
				for( j=0; result.indexOf(" ",j) !== -1; j=result.indexOf(" ",j)+1 );
			
			lines.push( result.substr(0, j|| result.length) );
			width = Math.max( width, context.measureText(lines[ lines.length-1 ]).width );
			text  = text.substr( lines[ lines.length-1 ].length, text.length );
		}
		
		
		// Calculate canvas size, add margin
		context.canvas.width  = 14 + width;
		context.canvas.height =  8 + ( fontSize + 5 ) * lines.length;
		context.font   = font;

		// Render
		context.fillStyle = color;
		for ( i=0, j=lines.length; i<j; ++i ) {
			context.fillText( lines[i], 8, 5 + fontSize + (fontSize+5) * i );
		}
		
		var x = getRandomInt(0, context.canvas.width - 200);
		var y = getRandomInt(0, context.canvas.height - 200);
		var data = context.getImageData(x, y, 200, 200);
		var canv2 = document.createElement("canvas");
		canv2.width = 200;
		canv2.height = 200;
		var context2 = canv2.getContext("2d");
		context2.putImageData(data, 0, 0);
		
		var img = canv2.toDataURL();
		document.getElementById("paperworker").style.backgroundImage = "url(" + img + ")";
		Game.finishLoader("paperworker");
	}
	
	try {
		Game.addLoader("paperworker");
		var ctx    = canvas.getContext('2d');
		var link = document.createElement('link');
		link.rel = 'stylesheet';
		link.type = 'text/css';
		link.href = 'http://fonts.googleapis.com/css?family=Special+Elite';
		document.getElementsByTagName('head')[0].appendChild(link);

		// Trick from http://stackoverflow.com/questions/2635814/
		var image = new Image;
		image.src = link.href;
		image.onerror = function() {
			setTimeout(function() {
				todo(ctx, paperwork, 12, "black");
			}, 1000);
		}
		
		Game.addLoader("yessir");
		var img = new Image;
		img.src = "images/yessir.png";
		img.onload = function() {
			Game.finishLoader("yessir");
		}
	}
	catch(e) {
		Game.finishLoader("paperworker");
		Game.finishLoader("yessir");
		Game.Initialize()();
	}
	
	Game.checkLoad();
}