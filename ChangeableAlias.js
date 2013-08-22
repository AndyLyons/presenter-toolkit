/**
 * @class
 *
 * An Alias that can have its wrapped property changed at any time.
 * As a result it does not have to be initialised with another property
 * when it is created. This can be useful if you have a property which
 * you cannot create in the constructor, but which you still need to
 * exist to bind.
 * 
 * @constructor
 */
ChangeableAlias = function(oProperty)
{
	caplin.presenter.property.Property.call(this);

	this.setAliasProperty(oProperty);
};

caplin.extend(ChangeableAlias, caplin.presenter.property.Alias);

ChangeableAlias.prototype.setAliasProperty = function(oProperty)
{
	if(this.m_oWrappedProperty && this.m_oWrappedListener)
	{
		this.m_oWrappedProperty.removeListener(this.m_oWrappedListener);
	}

	if(oProperty instanceof caplin.presenter.property.Property)
	{
		this.m_oWrappedProperty = oProperty;
		this.m_oWrappedListener = oProperty.addChangeListener(this, "_onWrappedChanged", true);
	}
	else
	{
		this.m_oWrappedProperty = null;
		this.m_oWrappedListener = null;
		this._$setInternalValue(null);
	}
};

ChangeableAlias.prototype.getValue = function()
{
	if(this.m_oWrappedProperty)
	{
		return this.m_oWrappedProperty.getValue();
	}
	else
	{
		return null;
	}
};

ChangeableAlias.prototype.getFormattedValue = function()
{
	if(this.m_oWrappedProperty)
	{
		return this.m_oWrappedProperty.getFormattedValue();
	}
	else
	{
		return null;
	}
};

ChangeableAlias.prototype.getRenderedValue = function()
{
	if(this.m_oWrappedProperty)
	{
		return this.m_oWrappedProperty.getRenderedValue();
	}
	else
	{
		return null;
	}
};
