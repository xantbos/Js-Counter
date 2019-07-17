/*
checklist.js Copyright © nemusg. License is MIT.
http://nemusg.com/checklist.html

Modifications by Xant
*/

$(function(){

	//このclass名がクリックされたら動く
	$(".checklist-js").on('click', maker1);

	var el = document.querySelector('#checklist');
	var text = el.dataset.text;
	var file = el.dataset.file;
	
	var shareURL = ""; // make it an easy glob zzz
	
	// パラメータの値を取得し、処理を分岐
	var urlVars = getUrlVars();
	//console.log(urlVars);
	if (urlVars[0] !== window.location.href) {
	    for (var i = 0; i < urlVars.length; i++ ) {
	        $('input[id="' + parseInt(urlVars[i], 10) +'"]').prop('checked', true);//本当は10→36にしたい
	    }
	}

	// 一回だけ実行
	loadState();
	checked();
	maker1();

	function getUrlVars(){
	    return window.location.href.slice(window.location.href.indexOf('?') + 1).split(',');
	}

	$('.allCheck input,.allCheck label').on('click',function(){ //全選択・全解除をクリックしたとき
	    var items = $(this).closest('.allCheck').next().find('input');
	    if($(this).is(':checked')) { //全選択・全解除がcheckedだったら
	        $(items).prop('checked', true); //アイテムを全部checkedにする
	    } else { //全選択・全解除がcheckedじゃなかったら
	        $(items).prop('checked', false); //アイテムを全部checkedはずす
	    }
	checked();
	});
	
	// share code
	$('p#genShare01').on('click',function(){ 
		copyToClipboard("http://fgo-tracker.ddns.net/?" + shareURL);
		$( "div.success").stop(true);
		$( "div.alert-box" ).html("URL Copied")
		$( "div.success" ).fadeIn( 300 ).delay( 1500 ).fadeOut( 400 );
		// alert();
		return false;
	});
	
	// save code
	$('p#genSave01').on('click',function(){ 
		saveState();
		$( "div.success").stop(true);
		$( "div.alert-box" ).html("Checklist Saved")
		$( "div.success" ).fadeIn( 300 ).delay( 1500 ).fadeOut( 400 );
		// alert();
		return false;
	});

	function checked(){
	    // checkbox, radio にチェックがあったら label に class を付ける
	    var checkboxList = $("#my-form");
	    checkboxList.each(function() {
	        var label = $(this).find("label");
	        // 最初の処理
	        $(this).find(":checked").closest("label").addClass("checked");
	        // ラベルクリック
	        label.on('click',function() {
	            label.filter(".checked").removeClass("checked");
	            label.find(":checked").closest(label).addClass("checked");
	        });
	    });
	}

	function maker1(){
		// チェックボックスの値を取得する
		var $checked = $('#my-form label input:checked');
		var valList = $checked.map(function(index, el) { return $(this).val(); });
		var valListShare = $checked.map(function(index, el) { return parseInt($(this).val()).toString(10); }) .get().join(",");//本当は10→36にしたい
		shareURL = valListShare;

		// チェックボックスの数を取得する
		var checkLengthAll = 0;
		var checkLength = 0;
		// moved % to under due to new calculation method
		
		// variable rarity checklist generation and functionality
		var rarities = ["SSR", "SR", "R", "B2", "B1", "Z"]; // suffixes for jquery matching
		rarities.forEach(function(item) {
			var thisRarityCheckLengthAll = $('.cfx-' + item).length;
			var thisRarityCheckLength = 0;
			$('.cfx-' + item).each(function(index) {
				if($(this).parent().hasClass('checked')){
					thisRarityCheckLength++;
				}
			});
			var thisRarityCheckRate = Math.floor(thisRarityCheckLength / thisRarityCheckLengthAll *100);
			$('span.subtotal-' + item).html(thisRarityCheckRate + '％ （' + thisRarityCheckLength + '/' + thisRarityCheckLengthAll + '）');
			// add our overalls
			checkLength += thisRarityCheckLength;
			checkLengthAll += thisRarityCheckLengthAll;
		});
		
		// do the monster math
		var checkRate = Math.floor(checkLength / checkLengthAll *100);
		
		$('#maker-kekka1').html('Overall: <em>' + checkRate + '</em>％ （' + checkLength + '/' + checkLengthAll + '）');
		$('#maker-kekka2').html('Overall: <em>' + checkRate + '</em>％ （' + checkLength + '/' + checkLengthAll + '）');
		
		/*if ( checkLength != 0) {// 1つ以上選択している
		$('#maker-twitter1').html('<a href="https://twitter.com/intent/tweet?data-related=rtwiki_net&related=rtwiki_net&text=' + text + checkRate + '%ef%bc%85%e3%81%a7%e3%81%99%20http://pad.rtwiki.net/tool/' + file + '?' + valListShare + '%20%23rtwiki_net%20%23pzdr" target="_blank">結果をツイート</a>');
		}else{// 1つも選択していない
		$('#maker-twitter1').html('<a href="https://twitter.com/intent/tweet?data-related=rtwiki_net&related=rtwiki_net&text=' + text + checkRate + '%ef%bc%85%e3%81%a7%e3%81%99%20http://pad.rtwiki.net/tool/' + file + valListShare + '%20%23rtwiki_net%20%23pzdr" target="_blank">結果をツイート</a>');
		}*/

		// アドレスバーのURLを書き換える
		/*if ( checkLength != 0) {// 1つ以上選択している
			history.replaceState('','', file + '?' + valListShare);
		}else{// 1つも選択していない
			history.replaceState('','', file);
		}
		*/
	}
	
	// save session into localstorage
	function saveState(){
		//console.log("save " + shareURL);
		localStorage.setItem('checklist', shareURL);
	}
	
	// load session from localstorage and trigger simulated
	// click of each item to render a proper form state
	function loadState(){
		shareURL = localStorage.getItem('checklist');
		//console.log("load " + shareURL);
		try {
			boxesToCheck = shareURL.split(",");
			boxesToCheck.forEach(function (item) {
				if(!$('#' + item).is(":checked")){
					$('#' + item).parent().trigger( "click" );
				}
			});
		}
		catch(err){/*pass*/}
	}
	
	function copyToClipboard(str){
		const el = document.createElement('textarea');
		el.value = str;
		document.body.appendChild(el);
		el.select();
		document.execCommand('copy');
		document.body.removeChild(el);
	}
});



