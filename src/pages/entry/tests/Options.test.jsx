import { render, screen } from "@testing-library/react";

import Options from "../Options";

test("displays image from each scoop option from server", () => {
  render(<Options optionType="scoops" />);

  // find images
  const scoopImages = screen.getAllByRole("img", { name: /scoop$/i });
});
