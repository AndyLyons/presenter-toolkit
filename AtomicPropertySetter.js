/**
 * @class
 *
 * Sets the values on a group of properties atomically. None of the property
 * listeners are called until the internal value of all the properties has
 * been set.
 *
 * The AtomicPropertySetter also provides a property which is changed once every
 * time a set of properties is updated. This can be useful if you have a listener
 * which is dependent on multiple properties, as it allows you to only trigger a 
 * the listener once for a set of properties being updated, rather than having it 
 * be triggered once for every property.
 * 
 * @constructor
 */
AtomicPropertySetter = function(mProperties)
{
	this.m_mProperties = mProperties;
	this.m_oAtomicProperty = new caplin.presenter.property.WritableProperty(0);
};

AtomicPropertySetter.prototype.setProperties = function(mProperties)
{
	this.m_mProperties = mProperties;
};

AtomicPropertySetter.prototype.setValues = function(mPropertyValues)
{
	for(var sPropertyName in mPropertyValues)
	{
		if(mPropertyValues.hasOwnProperty(sPropertyName))
		{
			var oProperty = this.m_mProperties[sPropertyName];
			if(oProperty instanceof caplin.presenter.property.Property)
			{
				var vPropertyValue = mPropertyValues[sPropertyName];
				oProperty._$setInternalValue(vPropertyValue);
			}
		}
	}
	
	this.m_oAtomicProperty.setValue(this.m_oAtomicProperty.getValue()+1);
};

/**
 * Returns a property whose value is changed after a set of properties have had 
 * their value set.
 */
AtomicPropertySetter.prototype.getAtomicChangeProperty = function()
{
	return this.m_oAtomicProperty;
};
