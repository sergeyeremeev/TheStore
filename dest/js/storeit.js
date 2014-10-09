jQuery(document).ready(function($) {
//    if($('.btn.store').hasClass('complete')){
//        $('.btn.store').removeClass('open-popup');
//    }

    var loggedIn = false;

    var body = $('body');

    body.on('click', '[data-store-it]', function() {
        var el = $(this);
        var url = ( el.data('store-it') == undefined ? el.href : el.data('store-it') );
        var dtype = ( el.data('fancybox-type') == undefined ? 'ajax' : el.data('fancybox-type') );
        loggedIn = loggedIn || (el.data('require-login') == 'no');
		
        var handler = function() {
            loggedIn = true;
//            if (el.hasClass('active')) {
//                $.post('/profile/likes/removefromwishlists', {product_id: el.data('id')}, function(response) {
//                    if (response == 'deleted') {
//                        el.removeClass('active');
//                        try {
//                            el.trigger('unstored');
//                        } catch (e) {}
//                    }
//                });
//            } else {
                var popupOpener = $('#default-popup-opener');
                popupOpener.data('fancybox-type', dtype);
                popupOpener.attr('href', url).trigger('click');
            //}
        };
        if (loggedIn) {
            handler();
        } else {
            window.openLoginPopup({onSuccess: handler});
        }
        return false;
    });
    body.on('click', '#storeit', function() {
        var parent = $(this).closest('.item-actions');
        var wishlists = [];
        if(parent.find('input#catalog-name').val()){
            wishlists.push(parent.find('input#catalog-name').val());
        }
        var wishlist = parent.find('input.store-catalog:checked');
        $(wishlist).each(function(indx, elem){
            wishlists.push($(elem).data('name'));
        });
        var dataId = $(this).data('id');
        var data = {'wishlist_name': wishlists, 'item_id': dataId};
        $.post('/profile/likes/add', data, function(result){
            if(result!='error'&& !isNaN(result)){
            	
                var product = $('[data-store-it][data-id='+dataId+']');
                product.addClass('active');
                try {
                    product.trigger('stored');
                } catch (e) {}
                
                $(".lightbox.store .overlay").show().delay(800).queue(function(n) {
            		$(this).hide(); $.fancybox.close();
            	});
                
            } else {
                var t = window.application.tooltipObject.createTooltip(
                    $('#storeit'),
                    result, 0, -5);
                t.css('z-index', 10000);

            }
        });
    });
    
//    $('body').on('click', 'btn.store.complete', function(){
//        var dataId = $(this).data('store-it');
//        
//    });

    body.on('click', '.likeit', function(e){
        e.preventDefault();
        var button = $(this);
        loggedIn = loggedIn || (button.data('require-login') == 'no');
        var dataId = button.data('id');
        var type = button.data('type');
        var data = {'id': dataId,'type':type};
        var handler = function(){
            loggedIn = true;
            if (button.hasClass('active')) {
                $.post(
                        '/followers/index/removeajax',
                        data,
                        function(result) {
                            if (result.success) {
                                try {
                                    button.trigger('disliked');
                                } catch (e) {}
                                if(button.hasClass('my-list')){
                                    var container = button.closest('article.item');
                                    var masonryData = container.closest('.masonry-ready').data('masonry');
                                    container.remove();
                                    if (masonryData) {
                                        masonryData.reloadItems();
                                        masonryData.layout();
                                    }
                                }else{
                                    button.removeClass('active');
                                }
                            }
                        }, 'json'
                );
            } else {
                $.post(
                        '/followers/index/addajax',
                        data,
                        function(result) {
                            if (result.success) {
                                button.addClass('active');
                                try {
                                    button.trigger('liked');
                                } catch (e) {}
                                if (button.data('like-postaction') == 'refresh-followers') {
                                    var target = $('[data-tab=followers]');
                                    target.closest('li').removeClass('active');
                                    target.trigger('click');
                                }
                            }
                        }, 'json'
                );
            }
        };
        if(!loggedIn){
            window.openLoginPopup({onSuccess: handler});
        }else{
            handler();
        }
    });
});