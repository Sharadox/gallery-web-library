// @vitest-environment happy-dom
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useState } from "react";
import { afterEach, expect, test, vi } from "vitest";
import { Lightbox } from "@sharadox/gallery-web-library/lightbox";

afterEach(cleanup);

const LABELS = { close: "Close", previous: "Previous photo", next: "Next photo" };
const CLASSES = { lightbox: "box", control: "control", close: "close", previous: "previous", next: "next" };

function Viewer({
  count = 3,
  start = 0,
  onChange = vi.fn(),
}: {
  count?: number;
  start?: number | null;
  onChange?: (index: number | null, step: number) => void;
}) {
  const [index, setIndex] = useState<number | null>(start);
  return (
    <Lightbox
      count={count}
      index={index}
      onChange={(next, step) => {
        onChange(next, step);
        setIndex(next);
      }}
      label={`Photo ${index}`}
      labels={LABELS}
      classNames={CLASSES}
      strokes={{ chevron: 1.6 }}
    >
      {(shown, direction) => (
        <figure>
          Photo {shown} from {direction}
        </figure>
      )}
    </Lightbox>
  );
}

test("pages through the photos with the chevrons and the arrow keys, wrapping around, and tells the direction", () => {
  const changes = vi.fn();
  render(<Viewer onChange={changes} />);
  expect(screen.getByRole("dialog", { name: "Photo 0" }).className).toBe("box");
  expect(document.documentElement.style.overflow).toBe("hidden");
  fireEvent.click(screen.getByRole("button", { name: "Previous photo" }));
  expect(screen.getByText("Photo 2 from -1")).toBeDefined();
  act(() => void dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight" })));
  expect(screen.getByText("Photo 0 from 1")).toBeDefined();
  act(() => void dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft" })));
  expect(changes).toHaveBeenLastCalledWith(2, -1);
  expect(screen.getByRole("button", { name: "Next photo" }).className).toBe("control next");
});

test("pages with a swipe long enough, and ignores short ones", () => {
  render(<Viewer />);
  const dialog = screen.getByRole("dialog");
  fireEvent.touchStart(dialog, { touches: [{ clientX: 300 }] });
  fireEvent.touchEnd(dialog, { changedTouches: [{ clientX: 200 }] });
  expect(screen.getByText("Photo 1 from 1")).toBeDefined();
  fireEvent.touchStart(dialog, { touches: [{ clientX: 100 }] });
  fireEvent.touchEnd(dialog, { changedTouches: [{ clientX: 220 }] });
  expect(screen.getByText("Photo 0 from -1")).toBeDefined();
  fireEvent.touchStart(dialog, { touches: [{ clientX: 100 }] });
  fireEvent.touchEnd(dialog, { changedTouches: [{ clientX: 120 }] });
  fireEvent.touchEnd(dialog, { changedTouches: [] });
  fireEvent.touchStart(dialog, { touches: [] });
  fireEvent.touchEnd(dialog, { changedTouches: [{ clientX: 500 }] });
  expect(screen.getByText("Photo 0 from -1")).toBeDefined();
});

test("closes from the button, a click outside the photo or Escape, and lets the page scroll again", async () => {
  const changes = vi.fn();
  const { unmount } = render(<Viewer onChange={changes} />);
  fireEvent.click(screen.getByRole("button", { name: "Close" }));
  expect(changes).toHaveBeenLastCalledWith(null, 0);
  await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  unmount();
  render(<Viewer onChange={changes} />);
  fireEvent.click(screen.getByRole("dialog"));
  expect(changes).toHaveBeenLastCalledWith(null, 0);
  cleanup();
  render(<Viewer onChange={changes} />);
  act(() => void dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" })));
  expect(changes).toHaveBeenLastCalledWith(null, 0);
  expect(document.documentElement.style.overflow).toBe("");
});

test("shows one photo without paging, and nothing while closed", () => {
  const { container } = render(<Viewer count={1} />);
  expect(screen.queryByRole("button", { name: "Next photo" })).toBeNull();
  expect(screen.getByRole("button", { name: "Close" }).className).toBe("control close");
  act(() => void dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight" })));
  expect(screen.getByText("Photo 0 from 1")).toBeDefined();
  cleanup();
  render(<Viewer start={null} />);
  expect(screen.queryByRole("dialog")).toBeNull();
  expect(container.textContent).toBe("");
});

test("works without a shared control class", () => {
  render(
    <Lightbox
      count={2}
      index={0}
      onChange={vi.fn()}
      label="Photo"
      labels={LABELS}
      classNames={{ ...CLASSES, control: undefined }}
    >
      {() => <figure />}
    </Lightbox>,
  );
  expect(screen.getByRole("button", { name: "Close" }).className).toBe("close");
});
