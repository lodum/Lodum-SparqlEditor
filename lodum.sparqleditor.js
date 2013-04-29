var $ = jQuery.noConflict();

var prefixes ="base <http://data.uni-muenster.de/context/>\n"+
"prefix xsd: <http://www.w3.org/2001/XMLSchema#> \n"+
"prefix dct: <http://purl.org/dc/terms/> \n"+
"prefix dc: <http://purl.org/dc/elements/1.1/>\n"+
"prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> \n"+
"prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> \n"+
"prefix owl: <http://www.w3.org/2002/07/owl#>\n"+
"prefix isbd: <http://iflastandards.info/ns/isbd/elements/> \n"+
"prefix skos: <http://www.w3.org/2004/02/skos/core#> \n"+
"prefix bibo: <http://purl.org/ontology/bibo/> \n"+
"prefix rda: <http://RDVocab.info/ElementsGr2/> \n"+
"prefix blt: <http://data.bl.uk/schema/bibliographic#> \n"+
"prefix bio: <http://purl.org/vocab/bio/0.1/> \n"+
"prefix foaf: <http://xmlns.com/foaf/0.1/> \n"+
"prefix event: <http://purl.org/NET/c4dm/event.owl#>  \n"+
"prefix org: <http://www.w3.org/ns/org#> \n"+
"prefix geo: <http://www.w3.org/2003/01/geo/wgs84_pos#> \n"+
"prefix pv: <http://linkedscience.org/pv/ns#>\n"+
"prefix fn:<http://www.w3.org/2005/xpath-functions#>\n"+
"prefix vcard:<http://www.w3.org/2006/vcard/ns#>\n"+
"prefix aiiso:<http://purl.org/vocab/aiiso/schema#>\n"+
"prefix teach:<http://linkedscience.org/teach/ns#>\n"+
"prefix res:<http://www.medsci.ox.ac.uk/vocab/researchers/0.1/>\n"+
"prefix resume:     <http://rdfs.org/resume-rdf/#>\n"+
"prefix tis:<http://www.ontologydesignpatterns.org/cp/owl/timeindexedsituation.owl#>\n"+
"prefix ti:<http://www.ontologydesignpatterns.org/cp/owl/timeinterval.owl#>\n"+
"prefix lode:<http://linkedevents.org/ontology/>\n"+
"prefix wgs84:<http://www.w3.org/2003/01/geo/wgs84_pos#>\n"+
"prefix tipr:<http://www.ontologydesignpatterns.org/cp/owl/timeindexedpersonrole.owl#>";
$(document).ready(function () {
	addQueryLink();
	var query=$(document).getUrlParam("query") ;
	 if(query!=undefined && query!="" && query!="undefined"){
		$("#prefixlink").hide();
		// $("#sparqlQuery").val(decodeURIComponent(query));
		editor.setValue(unescape($(document).getUrlParam("query")));
		$("#prefixes").hide();
	}else{
		 $('#prefixes').text(prefixes).html();
		$('#prefixes').html($('#prefixes').html().replace(/\n/g,"<br>"));
		$("#prefixes").hide();
	}
});
		
// the CodeMirror stuff
var editor = CodeMirror.fromTextArea(document.getElementById("code"), {
  mode: "application/x-sparql-query",
  lineNumbers: true,
  onCursorActivity: function() {
    editor.setLineClass(hlLine, null);
    hlLine = editor.setLineClass(editor.getCursor().line, "activeline");
	addQueryLink();
  }
});
var hlLine = editor.setLineClass(0, "activeline");

// the AJAX stuff for displaying query results
function firequery(){
	
	$("#results").empty();
	
	var query=$(document).getUrlParam("query") ;
	if(query==undefined || query=="" || query=="undefined"){
		$code = prefixes+editor.getValue();
	}else{
		$code = editor.getValue();
	}
	

	var endpoint="http://data.uni-muenster.de/sparql";
	var request = { accept : 'application/sparql-results+json' };
	request.query=$code;
	$("#results").empty();
	$("#results").html('<div class="alert alert-info">Sending request...</div>');
	$.ajax({
		dataType: "json",
		beforeSend: function(xhrObj){xhrObj.setRequestHeader("Accept","application/sparql-results+json");},
		data: request,
		url: endpoint,
		success: callbackFunc,
		error: function (request, status, error) {
				$("#results").html('<div class="alert alert-error">'+request.responseText+'</div>');
	    }
	});
}

function callbackFunc(results) {		
		htmlString="<table class=\"table table-hover table-striped table-condensed\">";
		//write table head
		htmlString+="<thead><tr>";
			$.each(results.head.vars, function(index2, value2) { 
				htmlString+="<th>?"+value2+"</th>";
			 });
		htmlString+="</tr></thead><tbody>";
		//write table body
		$.each(results.results.bindings, function(index1, value1) { 
			htmlString+="<tr>";
			$.each(results.head.vars, function(index2, value2) { 
				if(value1[value2]!=undefined){
					htmlString+="<td>"+replaceURLWithHTMLLinks(value1[value2].value)+"</td>";
				}else{
					htmlString+="<td></td>";
				}
				//console.log(value1[value2].value)
			 });
			htmlString+="</tr>";
		});

		htmlString+="</tbody></table>";
		$("#results").html(htmlString);
	}
	
	function replaceURLWithHTMLLinks(text) {
	    var exp = /(\b(https?|ftp|file):\/\/\b(data.uni-muenster.de)[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
	    return text.replace(exp,"<a href='$1' target=\"_blank\">$1</a>"); 
	}

// adds a link to the query at the bottom of the text field:
function addQueryLink(){
		
	$('#querylink').remove();

	$link = 'http://data.uni-muenster.de/php/sparql/?query=' + escape(editor.getValue());
	
	jQuery("<a />").attr({href: $link, id: "querylink"}).appendTo("#linkp").text("Link to this query");
}
