var Charts = {
	_all : {},
	add : function(name, obj) {
		this._all[ name ] = obj;
	},
	get : function(name){
		return this._all[ name ];
	}
};