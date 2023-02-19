import axios from "axios";
import React, { Component } from "react";
import toast from "react-hot-toast";

export default class Fib extends Component {
  state = {
    seenIndexes: [],
    values: {},
    index: null,
  };

  componentDidMount() {
    this.fetchCurrentValues();
    this.fetchSeenIndexes();
  }

  async fetchSeenIndexes() {
    try {
      const response = await axios.get("/api/values/all");
      this.setState({ seenIndexes: response.data.data });
    } catch (e) {
      toast.error(e.message);
    }
  }
  async fetchCurrentValues() {
    try {
      const response = await axios.get("/api/values/current");
      this.setState({ values: response.data.data });
    } catch (e) {
      toast.error(e.message);
    }
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/values", {
        index: this.state.index,
      });
      this.setState({ index: null });
      toast.success(response.data.message);
    } catch (e) {
      toast.error(e.message);
    }
  };

  renderSeenIndexes() {
    return this.state.seenIndexes.map(({ number }) => number).join(", ");
  }

  renderValues() {
    const entries = [];

    for (let key in this.state.values) {
      entries.push(
        <div key={key}>
          For index {key} I calculated {this.state.values[key]}
        </div>
      );
    }

    return entries;
  }

  render() {
    return (
      <>
        <form onSubmit={this.handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Enter number</label>
            <input
              type="number"
              className="form-control"
              defaultValue={this.state.index}
              placeholder="Enter number to calculate the fib value"
              onChange={(e) => this.setState({ index: e.target.value })}
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>

        <hr />

        <h3>Indexes I have seen:</h3>
        {this.renderSeenIndexes()}

        <h3>Calculated Values:</h3>
        {this.renderValues()}
      </>
    );
  }
}
