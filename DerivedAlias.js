/**
 * @class
 *
 * An property whose value is derived from the value of another property.
 * 
 * @constructor
 */
DerivedAlias = function(oProperty, fDerive)
{
	this.m_fDerive = fDerive;

	if (!(oProperty instanceof caplin.presenter.property.Property))
	{
		throw new caplin.core.Error(caplin.core.Error.LEGACY, "A DerivedAlias can only constructed with a presenter Property");
	}

	/** @private */
	this.m_oWrappedProperty = oProperty;
	oProperty.addChangeListener(this, "_onWrappedChanged", false);
	
	var vInitial = this._getDerivedValue(oProperty.getValue());
	caplin.presenter.property.Property.call(this, vInitial);
};

caplin.extend(DerivedAlias, caplin.presenter.property.Property);

/**
 * Changes the derive function being run against the Alias property.
 * The derive function allows you to change the value of the alias
 * property before setting it to this property.
 */
DerivedAlias.prototype.setDeriveFunction = function(fDerive)
{
	this.m_fDerive = fDerive;
	this._onWrappedChanged();
};

DerivedAlias.prototype._getDerivedValue = function(vValue)
{
	if(this.m_fDerive && Object.prototype.toString.call(this.m_fDerive) === "[object Function]")
	{
		vValue = this.m_fDerive(vValue);
	}

	return vValue;
};

DerivedAlias.prototype._onWrappedChanged = function()
{
	var vValue = this.m_oWrappedProperty.getValue();
	vValue = this._getDerivedValue(vValue);
	this._$setInternalValue(vValue);
};
