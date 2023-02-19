import React from "react";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <div>
      <h4>About Us</h4>
      <p>
        Below is an example form built entirely with Bootstrap’s form controls.
        Each required form group has a validation state that can be triggered by
        attempting to submit the form without completing it.
      </p>
      <Link to="/">Go to Main Page</Link>
    </div>
  );
}
