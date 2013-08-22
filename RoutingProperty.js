/**
 * The RoutingProperty accepts a property, the value of which is used to determine which value should be selected from
 * the supplied map of other values / properties. To function correctly, the oRoutingProperty should only ever contain
 * string values that are mapped as keys in the mSelectionProperties object.
 *
 * When the oRoutingProperty contains a value that is not found in the mSelectionProperties object, an error will
 * be thrown.
 *
 * When the mSelectionProperties object contains values that are not instances of caplin.presenter.property.Property,
 * the RoutingProperty will use the element from mSelectionProperties as its value, when the value in mSelectionProperty
 * is a Property instance though, the RoutingProperty will act as a proxy for all updates to the selected property.
 *
 * @constructor
 * @name RoutingProperty
 *
 * @param {caplin.presenter.property.Property} oRoutingProperty
 * @param {Object} mSelectionProperties
 */
RoutingProperty = function (oRoutingProperty, mSelectionProperties)
{
	caplin.presenter.property.Property.call(this);

	this.m_oRoutingProperty = oRoutingProperty;
	this.m_mSelectionProperties = mSelectionProperties;

	this.m_oRoutingListener = this.m_oRoutingProperty.addChangeListener(this, '_onRoutingPropertyChange', true);
};
caplin.extend(RoutingProperty, caplin.presenter.property.Property);

/**
 * @type {caplin.presenter.property.Property}
 */
RoutingProperty.prototype.m_oCurrentProperty = null;

/**
 * @type {caplin.presenter.property.PropertyListener}
 */
RoutingProperty.prototype.m_oPropertyListener = null;

/**
 * Handles the currently selected property changing value
 */
RoutingProperty.prototype._onPropertyChange = function ()
{
	this._$setInternalValue(this.m_oCurrentProperty.getValue());
};

/**
 * Handles the routing property changing value
 */
RoutingProperty.prototype._onRoutingPropertyChange = function ()
{
	if (this.m_oCurrentProperty && this.m_oPropertyListener)
	{
		this.m_oCurrentProperty.removeListener(this.m_oPropertyListener);
		delete this.m_oPropertyListener;
	}

	var sRoutingProperty = this.m_oRoutingProperty.getValue();
	if (!this.m_mSelectionProperties.hasOwnProperty(sRoutingProperty))
	{
		throw new caplin.core.Error("RoutingProperty: '" + sRoutingProperty + "' route has not been specified.");
	}

	this.m_oCurrentProperty = this.m_mSelectionProperties[sRoutingProperty];
	if(this.m_oCurrentProperty && this.m_oCurrentProperty.addChangeListener)
	{
		this.m_oPropertyListener = this.m_oCurrentProperty.addChangeListener(this, '_onPropertyChange', true);
	}
	else
	{
		this._$setInternalValue(this.m_oCurrentProperty);
	}
};

/**
 * Adds debug logging to the RoutingProperty - will output to the console for each transition in the property used to
 * select the route.
 */
RoutingProperty.prototype.debug = function ()
{
	this._onRoutingPropertyChange = function() {
		console.log('RoutingProperty:changedRoute: ' + this.m_oRoutingProperty.getValue());
		return RoutingProperty.prototype._onRoutingPropertyChange.apply(this, arguments);
	};

	this.m_oRoutingProperty.removeListener(this.m_oRoutingListener);
	this.m_oRoutingListener = this.m_oRoutingProperty.addChangeListener(this, '_onRoutingPropertyChange', true);

	return this;
};

/**
 * Destroys the RoutingProperty instance by removing listeners from the routing and currently selected properties
 * and any listener on this instance.
 */
RoutingProperty.prototype.destroy = function ()
{
	this.m_oRoutingProperty.removeListener(this.m_oRoutingListener);
	if (this.m_oCurrentProperty && this.m_oPropertyListener)
	{
		this.m_oCurrentProperty.removeListener(this.m_oPropertyListener);
	}
	this.removeAllListeners();
};
