/**
 * @class
 * An implementation of the RoutingProperty which implements the various
 * EditableRoutingProperty functions, allowing it to proxy them to the current
 * property being routed to if it also implements EditableRoutingProperty.
 *
 * @constructor
 */
EditableRoutingProperty = function(oRoutingProperty, mSelectionProperties)
{
	this.m_pListeners = [];

	this.m_bCurrentPropertyIsEditable = false;

	caplin.presenter.property.EditableProperty.apply(this, arguments);
	RoutingProperty.apply(this, arguments);
};

caplin.extend(EditableRoutingProperty, caplin.presenter.property.EditableProperty);
caplin.extend(EditableRoutingProperty, RoutingProperty);

EditableRoutingProperty.prototype.setValue = function(vValue)
{
	if (this.m_oCurrentProperty instanceof caplin.presenter.property.WritableProperty)
	{
		this.m_oCurrentProperty.setValue(vValue);
	}
};

EditableRoutingProperty.prototype.setUserEnteredValue = function(vUserEnteredValue)
{
	if (this.m_bCurrentPropertyIsEditable)
	{
		this.m_oCurrentProperty.setUserEnteredValue(vUserEnteredValue);
	}
};

EditableRoutingProperty.prototype.addListener = function(oListener, bNotifyImmediately)
{
	this.m_pListeners.push(oListener);
	this.m_oCurrentProperty.addListener(oListener, bNotifyImmediately);
};

EditableRoutingProperty.prototype.removeListener = function(oListener)
{
	var nListenerIndex = this.m_pListeners.indexOf(oListener);
	this.m_pListeners.splice(nListenerIndex, 1);
	this.m_oCurrentProperty.removeListener(oListener);
};

EditableRoutingProperty.prototype.forceValidation = function()
{
	if (this.m_bCurrentPropertyIsEditable)
	{
		this.m_oCurrentProperty.forceValidation();
	}
};

/**
 * Supporting a function added via patches
 */
EditableRoutingProperty.prototype.hasValidationError = function() 
{
	if (this.m_bCurrentPropertyIsEditable)
	{
		this.m_oCurrentProperty.hasValidationError();
	}
};

/**
 * Supporting a function added via patches
 */
EditableRoutingProperty.prototype.removeValidators = function()
{
	if (this.m_bCurrentPropertyIsEditable)
	{
		this.m_oCurrentProperty.removeValidators();
	}
};

/**
 * Supporting a function added via patches
 */
EditableRoutingProperty.prototype.removeValidator = function(oValidator)
{
	if (this.m_bCurrentPropertyIsEditable)
	{
		this.m_oCurrentProperty.removeValidator(oValidator);
	}
};

EditableRoutingProperty.prototype._onRoutingPropertyChange = function()
{
	// This could be null/undefined the first time this gets called,
	// as it hasn't been initialized at that point
	if (this.m_oCurrentProperty)
	{
		for (var i = this.m_pListeners.length - 1; i >= 0; --i)
		{
			var oListener = this.m_pListeners[i];
			this.m_oCurrentProperty.removeListener(oListener);
		};
	}

	RoutingProperty.prototype._onRoutingPropertyChange.apply(this, arguments);
	this.m_bCurrentPropertyIsEditable = this.m_oCurrentProperty instanceof caplin.presenter.property.EditableProperty;

	for (var i = 0; i < this.m_pListeners.length; ++i)
	{
		var oListener = this.m_pListeners[i];
		this.m_oCurrentProperty.addListener(oListener, true);

		if (!this.m_bCurrentPropertyIsEditable)
		{
			// A normal property doesn't support validation rules and therefore is
			// always valid, so we need to force the validation listeners that are 
			// listening to validation successful.
			oListener["onValidationSuccess"].apply(oListener);
			oListener["onValidationComplete"].apply(oListener);
		}
	};
};

/***************
 * Unsupported
 ***************/
EditableRoutingProperty.prototype.addParser = function(oParser, mConfig)
{
	throw new caplin.core.Error("Unsupported method", "'addParser' is not supported on the EditableRoutingProperty." +
		"Parsers should be added to the individual properties being routed.", "EditableRoutingProperty");
};

EditableRoutingProperty.prototype.addValidator = function(oValidator, mConfig)
{
	throw new caplin.core.Error("Unsupported method", "'addValidator' is not supported on the EditableRoutingProperty." +
		"Validators should be added to the individual properties being routed.", "EditableRoutingProperty");
};

EditableRoutingProperty.prototype.onValidationResultReceived = function(oValidationResult)
{
	throw new caplin.core.Error("Unsupported method", "'onValidationResultReceived' is not supported on the EditableRoutingProperty." +
		"It should not have been called.", "EditableRoutingProperty");
};
