import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import App from "./App";

describe("App", () => {
  beforeEach(() => render(<App />));

  describe("Show Elements", () => {
    describe("Input Element", () => {
      it("should render input element", () => {
        const inputElement = screen.getByRole("textbox");
        expect(inputElement).toBeInTheDocument();
      });

      it("should input element render 'enter repository name'", () => {
        const inputElement = screen.getByRole("textbox");
        const placeholderInputElement = inputElement.getAttribute("placeholder");
        expect(placeholderInputElement).toBe("Enter repository name");
      });
    });

    describe("Button Element", () => {
      it("should render button element", () => {
        const buttonElement = screen.getByRole("button");
        expect(buttonElement).toBeInTheDocument();
      });

      it("should button element has 'Search' text content", () => {
        const buttonElement = screen.getByRole("button");
        expect(buttonElement).toHaveTextContent("Search");
      });

      it("should button element type is submit", () => {
        const buttonElement = screen.getByRole("button");
        const typeButtonElement = buttonElement.getAttribute("type");
        expect(typeButtonElement).toBe("submit");
      });
    });
  });

  describe("Searching", () => {
    const handleSearching = () => {
      const inputElement = screen.getByRole("textbox");
      fireEvent.change(inputElement, { target: { value: "example" } });
      const buttonElement = screen.getByRole("button");
      fireEvent.click(buttonElement);
    };

    it("should render result message div element when searching when input value is example", async () => {
      handleSearching();
      const resultMessageDivElement = await waitFor(
        async () => await screen.findByTestId("result-message"),
        {
          timeout: 10000,
        }
      );
      expect(resultMessageDivElement).toBeInTheDocument();
    });

    it("should render showing accordion-item-0 testid element repositories when input value is example", async () => {
      handleSearching();
      const accordionItemDivElement = await waitFor(
        async () => await screen.findByTestId("accordion-item-0"),
        { timeout: 10000 }
      );
      expect(accordionItemDivElement).toBeInTheDocument();
    });

    it("should render showing 10 data repositories when input value is example", async () => {
      handleSearching();
      const accordionItemDivElements = await waitFor(
        async () => await screen.findAllByTestId(/accordion-item/i),
        { timeout: 10000 }
      );
      expect(accordionItemDivElements.length).toBe(10);
    });
  });
});
