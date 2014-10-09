window.productimagesManager = null;
$(function() {

    window.productimagesManager = {
        url: '/profile/ajax/getproductimages/',
        data: {
            products: {}
        },
        grid_mode: $('.item-list [data-grid-for-type=products] > div:visible').data('grid-target'),
        query: function(list) {
            var self = this;
            var toLoad = [];
            $.each(list, function() {
                var product;
                var item = this;
                if (self.data.products.hasOwnProperty(item.id)) {
                    product = self.data.products[item.id];
                    if (product.loaded) {
                        item.handler(product);
                    } else {
                        $(product).on('loaded-images', function() {
                            item.handler(product);
                        });
                    }
                } else {
                    toLoad.push(item.id);
                    product = {
                        id: item.id,
                        loaded: false,
                        images: null
                    };
                    self.data.products[item.id] = product;
                    $(product).on('loaded-images', function() {
                        item.handler(product);
                    });
                }
            });
            if (toLoad.length > 0) {
                $.get(self.url, {products: toLoad}, function(response) {
                	var items = [];
                	var grid = $('.item-filter .item-filter-grid');
                	$.each(response, function(id, items) {
                        var images = items;
                        if (self.data.products.hasOwnProperty(id)) {
                            var product = self.data.products[id];
                            product.loaded = true;
                            product.images = images;
                            $(product).trigger('loaded-images');
                        }

	                }); 
                });
            }
        },
        refresh: function(selector) {
            var self = this;
            selector = $(selector);
            var items = [];
            
            selector.find('[data-images-manager=unloaded]').add(selector.filter('[data-images-manager=unloaded]')).each(function() {
                var el = $(this);
                
                var sizetouse = 'square';
                console.log(self.grid_mode);
                if (self.grid_mode == 'default') {
                    sizetouse = 'default';
                } else if (self.grid_mode == 'grid' && el.parents('article').hasClass('big')) {
                    sizetouse = 'big';
                } else if (self.grid_mode == 'grid' && !el.parents('article').hasClass('big')) {
                	sizetouse = null;
                }
                var id = el.data('id');
                var handler = function(product) {
                    el.data('images-manager', 'loaded');
                    if(!sizetouse) return;
                    if (product.images.length > 0) {
                    	var images = [];
                    	$.each(product.images, function(i, item) {
                            images.push('<li>' + item[sizetouse] + '</li>');
                    	});
                        el.find('ul.pre-slideset').removeClass('pre-slideset').addClass('slideset').append(images.join('')); // 
                        el.closest('article').fadeGallery({
                            slides: '.slideset > li',
                            generatePagination: '.pagination',
                            autoHeight: true,
                            switchTime: 2000,
                            animSpeed: 600,
                            useSwipe: true
                        });
                    }
                };
                items.push({
                    id: id,
                    handler: handler
                });
            });
            self.query(items);
        },
        init: function() {
            var self = this;
            $('body')
                .on('grid-manager-added-items', function(e, items) {
                    self.refresh(items);
                });
        }
    };

    window.productimagesManager.init();

});