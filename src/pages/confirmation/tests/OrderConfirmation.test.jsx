import {
  render,
  screen,
  waitFor,
} from "../../../test-utils/testing-library-utils";
import OrderConfirmation from "../OrderConfirmation";
import { rest } from "msw";
import { server } from "../../../mock/server";

test("handles error for confirmation order", async () => {
  server.resetHandlers(
    rest.post("http://localhost:3030/order", (req, res, ctx) => {
      res(ctx.status(500));
    })
  );

  render(<OrderConfirmation setOrderPhase={jest.fn()} />);

  await waitFor(async () => {
    const alerts = await screen.findByRole("alert");
    expect(alerts).toHaveTextContent(
      "An unexpected error occurred. Please try again later."
    );
  });
});
