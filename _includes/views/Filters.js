views.Filters = Backbone.View.extend({
    initialize: function () {
        this.collection.on('update', this.render, this);
    },
    render: function() {
        var view = this,
            models = [],
            active = this.collection.where({ active: true });
        
        if ($('.btn-' + this.collection.id).html()) {
            var chartType = $('.btn-' + this.collection.id + ' button.active').html().toLowerCase();
        }

        if(active.length) {
            models = active;
        } else {
            this.collection.sort();
            models = _(this.collection.sortBy(function(model) {
                    return -1 * model.get(chartType);
                })
                .filter(function(model) {
                    return (model.get(chartType) > 0)
                }))
                .first(5);
        }
    
        if (!models.length) return this;

        this.$el.html(templates.filters(this));

        _(models).each(function(model) {
            view.$('.filter-items').append(templates.filter({ model: model }));
            $('#' + view.collection.id + '-' + model.id).toggleClass('active', model.get('active'));
        });

        var max = models[0].get(chartType);

        // Build charts
        $('.data', '#chart-' + this.collection.id).empty();
        $('.caption', '#chart-' + this.collection.id).empty();

        _(models).each(function(model) {
            if (chartType == 'budget') {
                var label = (model.get(chartType) / max * 100) > 28 ? accounting.formatMoney(model.get(chartType)) : '';
            } else {
                var label = (model.get(chartType) / max * 100) > 15 ? model.get(chartType) : '';
            }
            $('.data', '#chart-' + model.collection.id).append(
                '<div style="width: ' + (model.get(chartType)/ max * 100) + '%">' + label + '</div>'
            );
            $('.caption', '#chart-' + model.collection.id).append(
                '<div>' + model.get('name').toLowerCase() + '</div>'
            );
        });

        return this;
    }
});
