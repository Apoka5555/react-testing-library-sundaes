import { render, screen } from "../../../test-utils/testing-library-utils";
import userEvent from "@testing-library/user-event";
import ScoopOption from "../ScoopOption";

test("box turns red when typing invalid value", async () => {
  const user = userEvent.setup();
  render(<ScoopOption name="Vanilla" imagePath={jest.fn()} />);

  // update vanilla scoops to 1 and check the subtotal
  const vanillaInput = screen.getByRole("spinbutton", {
    name: "Vanilla",
  });

  await user.clear(vanillaInput);
  await user.type(vanillaInput, "1.5");

  expect(vanillaInput).toHaveClass("is-invalid");

  await user.clear(vanillaInput);
  await user.type(vanillaInput, "-1");

  expect(vanillaInput).toHaveClass("is-invalid");

  await user.clear(vanillaInput);
  await user.type(vanillaInput, "20");

  expect(vanillaInput).toHaveClass("is-invalid");

  await user.clear(vanillaInput);
  await user.type(vanillaInput, "3");

  expect(vanillaInput).not.toHaveClass("is-invalid");
});
