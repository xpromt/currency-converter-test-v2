import React from "react";

const Converter = (props) => {
  return (
    <div className="converter_container">
      <div className="field has-addons has-addons-right">
        <p className="control">
          <span className="select is-small">
            <select value={props.firstInput} onChange={props.handleFromCurreny}>
              {props.data.map((rate) => {
                return (
                  <option key={rate} value={rate}>
                    {rate}
                  </option>
                );
              })}
            </select>
          </span>
        </p>
        <p className="control">
          <input className="input is-small"
            type="number"
            value={props.fromAmount}
            onChange={props.onMoneyChangeFrom}
            min="1"
          />
        </p>
      </div>
      <div className="field has-addons has-addons-right">
        <p className="control">
          <span className="select is-small">
            <select value={props.secondInput} onChange={props.handleToCurreny}>
              {props.data.map((rate) => {
                return (
                  <option key={rate} value={rate}>
                    {rate}
                  </option>
                );
              })}
            </select>
          </span>
        </p>
        <p className="control">
          <input className="input is-small"
            type="number"
            value={props.toAmount}
            onChange={props.onMoneyChangeTo}
            min="1"
          />
        </p>
      </div>
    </div>
  );
}
export default Converter;
