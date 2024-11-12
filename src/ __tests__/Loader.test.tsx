import React from "react";
import { render } from "@testing-library/react";
import Loader from "../components/Loader";

describe("Loader Component", () => {
  it("renders the loader", () => {
    const { container } = render(<Loader />);
    expect(container.firstChild).toHaveClass("loader-container");
  });
});
