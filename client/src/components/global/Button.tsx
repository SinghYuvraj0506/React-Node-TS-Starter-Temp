import clsx from "clsx";
import { Button } from "../ui/button";

export type LoadingProps = {
  type: "submit" | "reset" | "button";
  text: string;
  className?: string;
  loading?: boolean;
  onClick?: () => void;
};

export const LoadingButton = ({
  type = "submit",
  className,
  loading,
  text,
  onClick,
}: LoadingProps) => {
  return (
    <Button
      type={type}
      className={clsx(className, {
        "cursor-not-allowed opacity-70": loading,
      })}
      disabled={loading}
      onClick={onClick}
    >
      {loading ? (
        <svg
          className="animate-spin h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          ></path>
        </svg>
      ) : (
        text
      )}
    </Button>
  );
};
