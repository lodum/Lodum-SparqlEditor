<?php
	header("Access-Control-Allow-Origin: *"); 
    require_once("../lib.simple_html_dom.php"); 


 $header='
	<!-- The CodeMirror stuff -->    
	<link rel="stylesheet" href="http://data.uni-muenster.de/php/sparql/lib/codemirror/codemirror.css">
    <script src="http://data.uni-muenster.de/php/sparql/lib/codemirror/codemirror.js"></script>
    <link rel="stylesheet" href="http://data.uni-muenster.de/php/sparql/lib/codemirror/theme/default.css">
    <script src="http://data.uni-muenster.de/php/sparql/lib/codemirror/mode.sparql.js"></script>
	
	<!-- our custom css -->
	<link rel="stylesheet" href="http://data.uni-muenster.de/php/sparql/lodum.sparqleditor.css">
	<script src="http://data.uni-muenster.de/php/sparql/lib/jquery.getUrlParam.js"></script>
';

$editor='
<div class="row">
	<div class="span12">        
		<h1>SPARQL Editor</h1>	
		Our SPARQL endpoint can also be queried directly using <a href="http://data.uni-muenster.de/sparql">http://data.uni-muenster.de/sparql</a>.<br/> Just copy&paste the URL for the endpoint and you can access and query the data from any other SPARQL client, for example, <a href="http://www.ldodds.com/projects/twinkle/">Twinkle (Desktop)</a> or <a href="http://linkedscience.org/tools/sparql-package-for-r/tutorial-on-sparql-package-for-r/">R</a>. <br/>
		<!--You may also take a look at our <a href="http://data.uni-muenster.de/examples_sparql.html">SPARQL Examples</a>.-->
		<br/>
		<button id="prefixlink" type="submit" class="btn btn-link" onclick="$(\'#prefixes\').toggle()">&rsaquo;&rsaquo; Show/Hide Prefixes</button>
		<div id="prefixes" style="margin-left:10px;"></div>
		<textarea id="code" name="code"  resize="both">
SELECT * WHERE {
	?a rdf:type foaf:Person .
}
LIMIT 10
		</textarea>
		<div class="row" style="margin-left:10px;"><p><small>The editor is based on <a href="http://codemirror.net/">CodeMirror</a> and <a href="http://jquery.com/">JQuery</a>. The triple store running in the backend is <a href="http://www.ontotext.com/owlim" target="_blank"><img src="http://data.uni-muenster.de/files/powered_by-owlim.png"  align="absmiddle" ></a></small></p><p align="right" id="linkp">&nbsp;</p></div>
		<button class="btn" onclick="firequery();">Submit</button>
		<div id="results" style="margin-top:20px;"></div>
	</div>
</div>
<script src="http://data.uni-muenster.de/php/sparql/lodum.sparqleditor.js"></script>
';


$html = file_get_html('http://data.uni-muenster.de/php/cache/cache_wordpress.php.html');
$footer=$html->find('footer', 0)->innertext;
$head =$html->find('head', 0)->innertext;
$html->find('head', 0)->innertext=$head.$header;
$html->find('div[class=container main]', 0)->innertext = $editor.'<footer>'.$footer.'</footer>'; 
echo $html;
?>
