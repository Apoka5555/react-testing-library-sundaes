import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";

test("order phases for happy path", async () => {
  const user = userEvent.setup();
  // render app
  const { debug } = render(<App />);

  // add ice cream scoops and toppings
  // update vanilla scoops to 1
  const vanillaInput = await screen.findByRole("spinbutton", {
    name: "Vanilla",
  });

  await user.clear(vanillaInput);
  await user.type(vanillaInput, "1");

  // update chocolate scoops to 2
  const chocolateInput = await screen.findByRole("spinbutton", {
    name: "Chocolate",
  });

  await user.clear(chocolateInput);
  await user.type(chocolateInput, "2");

  // tick M&Ms
  const mmsCheckbox = await screen.findByRole("checkbox", { name: "M&Ms" });
  await user.click(mmsCheckbox);

  // tick Hot Fudge
  const hotFudgeCheckbox = await screen.findByRole("checkbox", {
    name: "Hot fudge",
  });
  await user.click(hotFudgeCheckbox);

  // find and click order button
  const orderButton = screen.getByRole("button", { name: /order sundae!/i });
  await user.click(orderButton);

  // check summary information based on order
  const scoopsInfo = screen.getByRole("heading", { name: /scoops: \$/i });
  expect(scoopsInfo).toHaveTextContent("6.00");

  const toppingsInfo = screen.getByRole("heading", { name: /toppings: \$/i });
  expect(toppingsInfo).toHaveTextContent("3.00");

  // accept terms and conditions and click button to confirm order
  const checkbox = screen.getByRole("checkbox", {
    name: /terms and conditions/i,
  });
  await user.click(checkbox);

  const confirmButton = screen.getByRole("button", { name: /confirm order/i });
  await user.click(confirmButton);

  // Confirmation page is set to show Loading while order number is loading from the server
  const loading = screen.getByText(/loading/i);
  expect(loading).toBeInTheDocument();

  // confirm order number on confirmation page
  const orderNumber = await screen.findByText(/order number/i);

  expect(orderNumber).toBeInTheDocument();
  expect(orderNumber).toHaveTextContent("3955625481");

  // Loading has disappeared
  const loadingDisappeared = screen.queryByText(/loading/i);
  expect(loadingDisappeared).not.toBeInTheDocument();

  // click "new order" button on confirmation page
  const newOrderButton = screen.getByRole("button", {
    name: /create new order/i,
  });
  await user.click(newOrderButton);

  // check that scoops and toppings subtotal have been reset
  const scoopsSubtotal = screen.getByText("Scoops total: $", { exact: false });
  expect(scoopsSubtotal).toHaveTextContent("0.00");

  const toppingsSubtotal = screen.getByText("Toppings total: $", {
    exact: false,
  });
  expect(toppingsSubtotal).toHaveTextContent("0.00");

  // wait for items to appear so that Testing Library doesn't get angry about stuff
  // happening after test is over
  await screen.findByRole("spinbutton", { name: "Vanilla" });
  await screen.findByRole("checkbox", { name: "Cherries" });
});

test("toppings header optional display", async () => {
  const user = userEvent.setup();
  render(<App />);

  // update vanilla scoops to 1
  const vanillaInput = await screen.findByRole("spinbutton", {
    name: "Vanilla",
  });

  await user.clear(vanillaInput);
  await user.type(vanillaInput, "1");

  // update chocolate scoops to 2
  const chocolateInput = await screen.findByRole("spinbutton", {
    name: "Chocolate",
  });

  await user.clear(chocolateInput);
  await user.type(chocolateInput, "2");

  // find and click order button
  const orderButton = screen.getByRole("button", { name: /order sundae!/i });
  await user.click(orderButton);

  const toppingsHeader = screen.queryByRole("heading", { name: /toppings/i });
  expect(toppingsHeader).not.toBeInTheDocument();
});
