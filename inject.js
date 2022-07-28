//Remove the element that called this script as soon as this script loads (clean up after self)
document.getElementById("injElem").remove();

//If the popup element exists, kill it. 
//Otherwise, Create the popup div and append it to the body
if (!document.getElementById("myPop")) {
	console.log('Creating and appending /Menu.');
	elemPop = document.createElement('div');
	elemPop.id = 'myPop';
	menuCreate();
} else {
	console.log('/Menu already exists. Closing it.');
	menuKill()
}

//Create and append the menu, and load the css stylesheet.
function menuCreate() {
	var elemCSS = document.getElementById("myCSS");
	if (!elemCSS) {
		console.log('Creating CSS stylesheet.');
		var elemCSS = document.createElement("link");
		elemCSS.id = "myCSS";
		elemCSS.type = "text/css";
		elemCSS.rel = "stylesheet";
		elemCSS.media = "screen,print";
		document.getElementsByTagName("head")[0].appendChild(elemCSS);
	} else {
		console.log('CSS Stylesheet already exists, Updating the url to force it to reload.');
	}
	elemCSS.href = "https://sgtbane.github.io/bts-links/css.css?"+Math.random();
	
	//Create the menu
	var HTMLHeader = `
	<div class='drag-handle' id='myPopHeader'>/Menu</div>
	<div id='myPopClose' onClick='menuKill();'>X</div>
	`;
	
	//Basic options that can effect any page
	var HTMLOptions = `
	<div class='popSep'>Functions:</div>
	<div id='popBtnViewHTML' class='popBtn' onClick='viewhtml();')>View HTML</div>
	<div class='popSep'>Modify Attribute:</div>
	<div id='popBtnReadonly' class='popBtn' onClick='removeattrubute("*","readonly");')>XXX</div>
	<div id='popBtnDisabled' class='popBtn' onClick='removeattrubute("*","disabled")'>XXX</div>
	<div id='popBtnHidden' class='popBtn' onClick='removeattrubute("*","hidden")'>XXX</div>
	<div id='popBtnHidden2' class='popBtn' onClick='changetype("input","hidden","text")'>XXX</div>
	<div id='popBtnRequired' class='popBtn' onClick='removeattrubute("*","required")'>XXX</div>
	<div id='popBtnPassword' class='popBtn' onClick='changetype("input","password","text")'>XXX</div>
	<div id='popBtnMaxlength' class='popBtn' onClick='adjustattribute("*","maxLength",9999)'>Maxlength+</div>
	`;

	var HTMLSpecific="";
	//Specific options that only appear on cetian sites
	if (document.title=="TMI App") {
		HTMLSpecific = `
		<div class='popSep'>TMI:</div>
		<div id='popBtnTMI_Narrative' class='popBtn' onClick='TMI_Narrative();')>Narrative+</div>
		<div id='popBtnTMI_ChangeTech' class='popBtn' onClick='TMI_ChangeTech();')>ChangeTech</div>
		<div id='popBtnTMI_GetSkills' class='popBtn' onClick='TMI_GetSkills();')>Get Skills</div>
		<div id='popBtnTMI_GetCore' class='popBtn' onClick='TMI_GetCore();')>Scrape Core</div>
		<div id='popBtnTMI_timesheetBTS' class='popBtn' onClick='TMI_LoadSpecial("timesheetBTS");')>Timesheet BTS</div>
		<div id='popBtnTMI_timesheetBELL' class='popBtn' onClick='TMI_LoadSpecial("timesheetBELL");')>Timesheet BELL</div>
		<div id='popBtnTMI_oasisRelatedOrder' class='popBtn' onClick='TMI_LoadSpecial("oasisRelatedOrder");')>Oasis Related Order</div>
		<div id='popBtnTMI_wlSummary' class='popBtn' onClick='TMI_LoadSpecial("wlSummary");')>Workload Summary</div>
		<div id='popBtnTMI_espp' class='popBtn' onClick='TMI_LoadSpecial("espp");')>ESPP</div>
		<div id='popBtnTMI_jobDetails' class='popBtn' onClick='TMI_LoadSpecial("jobDetails");')>Job Details</div>
		<div id='popBtnTMI_splash' class='popBtn' onClick='TMI_LoadSpecial("splash");')>Splash</div>
		<div id='popBtnTMI_workLoadInquiry' class='popBtn' onClick='TMI_LoadSpecial("workLoadInquiry");')>Workload Inquiry</div>
		<div id='popBtnTMI_workloadFilter' class='popBtn' onClick='TMI_LoadSpecial("workloadFilter");')>Workload Filter</div>
		`
	}
	
	HTML_Final = HTMLHeader;
	HTML_Final = HTML_Final+"<div class='popOptions'>";
	HTML_Final = HTML_Final+HTMLOptions;
	HTML_Final = HTML_Final+HTMLSpecific;
	HTML_Final = HTML_Final+"</div>";
	
	elemPop.innerHTML = HTML_Final;
	document.body.appendChild(elemPop);
	makeDraggable(elemPop);
	updateLabels();
}


// Remove any related elements
function menuKill(){
	document.getElementById("myPop").remove();
	document.getElementById("myCSS").remove();
}

//function remove(elem){
//	elem.parentNode.remove();
//}

function makeDraggable(elmnt) {
	let pos1 = 0,
		pos2 = 0,
		pos3 = 0,
		pos4 = 0;

	let dragHandle = elmnt.getElementsByClassName("drag-handle")[0];
	if (dragHandle !== undefined) {
		// if present, the header is where you move the DIV from:
		dragHandle.onmousedown = dragMouseDown;
		dragHandle.ontouchstart = dragMouseDown; //added touch event

	} else {
		// otherwise, move the DIV from anywhere inside the DIV:
		elmnt.onmousedown = dragMouseDown;
		elmnt.ontouchstart = dragMouseDown; //added touch event
	}

	function dragMouseDown(e) {
		e = e || window.event;
		e.preventDefault();
		if (e.type == 'touchstart' || e.type == 'touchmove' || e.type == 'touchend' || e.type == 'touchcancel') {
			let evt = (typeof e.originalEvent === 'undefined') ? e : e.originalEvent;
			let touch = evt.touches[0] || evt.changedTouches[0];
			x = touch.pageX;
			y = touch.pageY;
		} else if (e.type == 'mousedown' || e.type == 'mouseup' || e.type == 'mousemove' || e.type == 'mouseover' || e.type == 'mouseout' || e.type == 'mouseenter' || e.type == 'mouseleave') {
			x = e.clientX;
			y = e.clientY;
		}

		console.log("drag start x: "+x+" y:"+y);

		pos3 = x;
		pos4 = y;
		document.onmouseup = closeDragElement;
		document.ontouchend = closeDragElement;
		document.onmousemove = elementDrag;
		document.ontouchmove = elementDrag;
	}

	function elementDrag(e) {
		e = e || window.event;
		e.preventDefault();
		if (e.type == 'touchstart' || e.type == 'touchmove' || e.type == 'touchend' || e.type == 'touchcancel') {
			let evt = (typeof e.originalEvent === 'undefined') ? e : e.originalEvent;
			let touch = evt.touches[0] || evt.changedTouches[0];
			x = touch.pageX;
			y = touch.pageY;
		} else if (e.type == 'mousedown' || e.type == 'mouseup' || e.type == 'mousemove' || e.type == 'mouseover' || e.type == 'mouseout' || e.type == 'mouseenter' || e.type == 'mouseleave') {
			x = e.clientX;
			y = e.clientY;
		}
		pos1 = pos3 - x;
		pos2 = pos4 - y;
		pos3 = x;
		pos4 = y;
		elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
		elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
	}

	function closeDragElement() {
		console.log("drag end x: "+pos3+" y:"+pos4);
		document.onmouseup = null;
		document.ontouchcancel = null; //added touch event
		document.ontouchend = null; //added touch event
		document.onmousemove = null;
		document.ontouchmove = null; //added touch event
	}
}
function updateLabels() {
	document.getElementById("popBtnReadonly").innerText = "Readonly ["+countattributes('*','readonly')+"]";
	document.getElementById("popBtnDisabled").innerText = "Disabled ["+countattributes('*','disabled')+"]";
	document.getElementById("popBtnHidden").innerText = "Hidden ["+countattributes('*','hidden')+"]";
	document.getElementById("popBtnHidden2").innerText = "Hidden2 ["+counttypes('*','hidden')+"]";
	document.getElementById("popBtnRequired").innerText = "Required ["+countattributes('*','required')+"]";
	document.getElementById("popBtnPassword").innerText = "Un-Star ["+counttypes('*','password')+"]";
}

function countattributes(classname, attribute) {
	var cnt=0;elem = document.getElementsByTagName(classname);
	for (var i=0, max=elem.length; i < max; i++) {
		if (elem[i].hasAttribute(attribute)) {cnt++;};
	};
	return cnt;
}
function adjustattribute(classname, attribute, value) {
	elem = document.getElementsByTagName(classname);
	for (var i=0, max=elem.length; i < max; i++) {
		if (elem[i].hasAttribute(attribute)) {
			if (elem[i].getAttribute(attribute)!=value) {
				elem[i].setAttribute(attribute, value);
			};
		};
	};
} 
function removeattrubute(classname, attribute) {
	elem = document.getElementsByTagName(classname);
	for (var i=0, max=elem.length; i < max; i++) {
		if (elem[i].hasAttribute(attribute)) {elem[i].removeAttribute(attribute);};
	};
	updateLabels();
}
function counttypes(classname, typea) {
	var cnt=0, elem = document.getElementsByTagName(classname);
	for (var i=0, max=elem.length; i < max; i++) {
		if (elem[i].type==typea) {cnt++;};
	};
	return cnt;
}
function changetype(classname, typea, typeb) {
	var elem = document.getElementsByTagName(classname);
	for (var i=0, max=elem.length; i < max; i++) {
		if (elem[i].type==typea) {elem[i].type=typeb;};
	};
	updateLabels();
}

function viewhtml() {
	var dat=document.documentElement.innerHTML;
	//replace < and > with text friendly versions
	dat = dat.replace(/\>/g,"&gt;");
	dat = dat.replace(/\</g,"&lt;");
	
	//replace links with clickable versions
	dat = dat.replace(/(href=|src=)\"(.*?)\"/gm, '$1"<a href="$2" target="_blank">$2</a>"')
	//dat = dat.replace(/(\"[^\s]+\.js\")/g, "<a href='$1'>$1</a>")
	var pop = window.open();
	pop.document.write(dat);
}

function TMI_Narrative() {
	var narr = document.getElementsByTagName("textarea")[0];
	if (narr.maxLength==9999) {
		alert("Narrative length already 9999");
	}else{
		narr.maxLength=9999;
		narr.style.overflow="scroll";
		alert("Narrative length set to 9999");
	};
} 

function TMI_ChangeTech() {
	var techCurrent = CORE.storage.getLocal("techID");
	var techChange = window.prompt("TechID", techCurrent);
	CORE.storage.setLocal("techID", techChange.toUpperCase());
	CORE.storage.setLocal("bellPein", techChange.toUpperCase());
	CORE.storage.setLocal("userId", techChange.toLowerCase());
	scheduleUtils.refreshSchedulePage();
}

function TMI_GetSkills() {
	var vSkills = CORE.storage.getLocal("techSkillList");
	vSkills=vSkills.replace(/\,/g ,"</td></tr><tr><td>");
	vSkills=vSkills.replace(/~/g,"</td><td>");
	var popSkill=window.open();
	popSkill.document.write("<table border='1px'><tr><th colspan='2'>"+CORE.storage.getLocal("technicianName")+"</th></tr><tr><th>Skill Name</th><th>Level</th></tr><tr><td>"+vSkills+"</td></tr></table>");
}

function TMI_GetCore() {
	html_pop="";
	const vars=[];
	
	var scripts = document.getElementsByTagName('script');
	for (var i=0, max=scripts.length; i < max; i++) {
		var html_scraped = httpGet(scripts[i].src);
		
		const regex = /CORE.storage.(get|set)Local\("(.*?)"/g;
		let result;
		while(result = regex.exec(html_scraped)) {
			if (!vars.includes(result[2])) {
				vars.push(result[2]);
			}
		} 
	}
	var popInfo=window.open();
	var HTMLInfo = "<table><tr><th>Variable</th><th>Value</th></tr>";
	for (var i=0, max=vars.length; i < max; i++) {
		HTMLInfo=HTMLInfo+"<tr><td>"+vars[i]+"</td><td style='height:30px;overflow-y:scroll;'>"+CORE.storage.getLocal(vars[i])+"</td></tr>";
	}
	var HTMLInfo=HTMLInfo+"</table>";
	popInfo.document.write(HTMLInfo);
}

function TMI_LoadSpecial(page) {
	if (page=="timesheetBTS") {
		TMI.page.loadAsync({name:"timesheetBTS",js:"js/timeSheet/timesheetBTS.js", json:"json/timeSheet/timesheetBTS.json",toolbarId:"TopContent", contentId:"MainContent", pageId:"timesheetBTS"});
	} else if (page=="timesheetBELL") {
		TMI.page.loadAsync({id:"timeWorkedBell",name:TMI.page.ListSchedule.label.timeworked, js:"js/timeSheet/timeWorkedBell.js", json:"json/timeSheet/timeWorkedBell.json", toolbarId:"TopContent", contentId:"MainContent", pageId:"timeWorkedBell"});
	} else if (page=="oasisRelatedOrder") {
		TMI.page.loadAsync({name:"oasisRelatedOrder",json:"json/jobDetails/oasisRelatedOrder.json",js:"js/jobDetails/oasisRelatedOrder.js",toolbarId:"TopContent", contentId:"MainContent", pageId:"oasisRelatedOrder"});
	} else if (page=="wlSummary") {
		TMI.page.loadAsync({name:"wlSummary", js:"js/pull/wlSummary.js", json:"json/pull/wlSummary.json", toolbarId:"TopContent", contentId:"MainContent", pageId:"wlSummary"});
	} else if (page=="espp") {
		TMI.page.loadAsync({name:"espp",json:"json/espp/espp.json",js:"js/espp/espp.js",toolbarId:"TopContent", contentId:"MainContent", pageId:"espp"});
	} else if (page=="jobDetails") {
		TMI.page.loadAsync({name:"jobDetails",json:"json/jobDetails/jobDetails_new.json",js:"js/jobDetails/jobDetails_new.js", toolbarId:"TopContent", contentId:"MainContent", pageId:"jobDetails"});
	} else if (page=="splash") {
		TMI.page.loadAsync({name:"splash",json:"json/splash/splash.json",js:"js/splash/splash.js",toolbarId:"TopContent", contentId:"MainContent", pageId:"splash"});
	} else if (page=="workLoadInquiry") {
		TMI.page.loadAsync({name:"workLoadInquiry", js:"js/workLoadInquiry/workLoadInquiry.js", json:"json/workLoadInquiry/workLoadInquiry.json", toolbarId:"TopContent", contentId:"MainContent", pageId:"workLoadInquiry"});
	} else if (page=="workloadFilter") {
		TMI.page.loadAsync({name:"workloadFilter", js:"js/pull/workloadFilter.js", json:"json/pull/workloadFilter.json", toolbarId:"TopContent", contentId:"MainContent", pageId:"workloadFilter"});
	} 
} 

function httpGet(theUrl) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}





//javascript:(function(){var injElem = document.getElementById("injElem");if (injElem) {injElem.remove();};injElem=document.createElement('script');injElem.src='https://home.manticore.ca/bts/inject.js?'+Math.random();injElem.id='injElem';document.head.appendChild(injElem);}());
	
//javascript:(function(){document.getElementsByTagName('head')[0].appendChild(document.createElement('script')).src='https://inject.manticore.ca/test.js?%27+Math.random();}());

//TMI.page.loadAsync({name:"timesheetBTS",js:"js/timeSheet/timesheetBTS.js", json:"json/timeSheet/timesheetBTS.json",toolbarId:"TopContent", contentId:"MainContent", pageId:"timesheetBTS"});
//TMI.page.loadAsync({id:"timeWorkedBell",name:TMI.page.ListSchedule.label.timeworked, js:"js/timeSheet/timeWorkedBell.js", json:"json/timeSheet/timeWorkedBell.json", toolbarId:"TopContent", contentId:"MainContent", pageId:"timeWorkedBell"});
//TMI.page.loadAsync({name:"oasisRelatedOrder",json:"json/jobDetails/oasisRelatedOrder.json",js:"js/jobDetails/oasisRelatedOrder.js",toolbarId:"TopContent", contentId:"MainContent", pageId:"oasisRelatedOrder"});
//TMI.page.loadAsync({name:"wlSummary", js:"js/pull/wlSummary.js", json:"json/pull/wlSummary.json", toolbarId:"TopContent", contentId:"MainContent", pageId:"wlSummary"});
//TMI.page.loadAsync({name:"espp",json:"json/espp/espp.json",js:"js/espp/espp.js",toolbarId:"TopContent", contentId:"MainContent", pageId:"espp"});
//TMI.page.loadAsync({name:"jobDetails",json:"json/jobDetails/jobDetails_new.json",js:"js/jobDetails/jobDetails_new.js", toolbarId:"TopContent", contentId:"MainContent", pageId:"jobDetails"});
//TMI.page.loadAsync({name:"splash",json:"json/splash/splash.json",js:"js/splash/splash.js",toolbarId:"TopContent", contentId:"MainContent", pageId:"splash"});
//







