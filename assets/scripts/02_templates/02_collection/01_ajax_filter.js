(function($){
	var popped = ('state' in window.history && window.history.state !== null),
	initialURL = location.href;

		//function to handle the scenarios where back and forward buttons used in browser
		$(window).bind("popstate", function (e) {
            // Ignore inital popstate that some browsers fire on page load
            var initialPop = !popped && location.href == initialURL;
            popped = true;
            if (initialPop) {
            	return;
            }
            ajaxLoadPage(location.href);
        });

		//the ajax function that does the AJAX calls to get the products and load them into the grid
		var ajaxLoadPage = function (url) {
			$.ajax({
				type: 'GET',
				url: url,
				data: {},
				complete: function (data) {
                    var tagResults = $(".grid", data.responseText).html();
                    $('.grid').html(tagResults).fadeIn(2000);
                    $(".grid").css("height","auto");
                    $('.grid-wrapper').css({
                        height : ($('.grid').height())
                    });

                    history.pushState({
                        page: url
                    }, url, url);
				}
			});
		}

		{% capture pathUrl %}{% if collection.handle %}{% capture url %}/collections/{{ collection.handle }}{% endcapture %}{{ url }}{% elsif collection.all_products_count > 0 and collection.products.first.type == collection.title %}{{ link_to_type }}{% elsif collection.all_products_count > 0 and collection.products.first.vendor == collection.title %}{{ link_to_vendor }}{% endif %}{% endcapture %}  
		
		var collectionUrl = window.location.protocol+'//'+window.location.hostname+'{{ pathUrl}}';    

        //this detects one of the filters being clicked that should then 
        //decide what URL to call in order to get the newly filtered product grid
        $("#filter-1 ul li a, #filter-2 ul li a").click(function (event) {
        	event.preventDefault();
        	var title = $(this).attr('title');
        	var self = this;

            $('.grid').fadeOut(200);

            // check if the click is on a "remove tag" filter
            var isRemoveFilter = false;
            if ($(this).parent().hasClass('active')) {
            	$(this).parent().removeClass('active');
            	$(this).removeAttr('title');
            	isRemoveFilter = true;
            } else if ($(this).parent().hasClass("all")) {
                //check if "all brands" or "all colors" clicked
                var ul = $(this).parent().parent();
                $('li', ul).removeClass('active');
                $('li a', ul).removeAttr('title');
                isRemoveFilter = true;
            } else {
                //otherwise it means click on an unfiltered tag
                //remove other "Remove tag" in same filter row
                var ul = $(this).parent().parent();
                $('li', ul).removeClass('active');
                $('li a', ul).removeAttr('title');

                //add the active tag onto the new filter that was clicked
                $(this).parent().addClass('active');
                $(this).attr('title', 'Remove tag ' + $(this).text());
            }

            var activeBrand = '';
            if ($('#filter-1 ul li.active a').length > 0) {
            	activeBrand = $('#filter-1 ul li.active a').text();
            }
            var activeColor = '';
            if ($('#filter-2 ul li.active a').length > 0) {
            	activeColor = $('#filter-2 ul li.active a').text();
            }

            var selectedBrand = '';
            if ($(this).parents().hasClass('brands') && !isRemoveFilter) {
            	selectedBrand = $(this).text();
            }
            var selectedColor = '';
            if ($(this).parents().hasClass('colors') && !isRemoveFilter) {
            	selectedColor = $(this).text();
            }

            // console.log('activeBrand = ' + activeBrand);
            // console.log('activeColor = ' + activeColor);
            // console.log('selectedBrand = ' + selectedBrand);
            // console.log('selectedColor = ' + selectedColor);

            var url = $(this).attr('href');

            var newBrand = selectedBrand || activeBrand;
            var newColor = selectedColor || activeColor;
            // console.log('newBrand = ' + newBrand);
            // console.log('newColor = ' + newColor);

            url = collectionUrl + "/collections/all/";

            if (newBrand != '' && newColor != '') {
            	url += newBrand + "+" + newColor;
            } else if (newColor != '') {
            	url += newColor;
            } else if (newBrand != '') {
            	url += newBrand;
            }

            // console.log(url);	
            ajaxLoadPage(url);
        });
})(jQuery);