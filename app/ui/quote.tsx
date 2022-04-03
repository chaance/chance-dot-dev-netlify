import * as React from "react";
import cx from "clsx";

const Quote = React.forwardRef<HTMLElement, QuoteProps>(
	({ children, className, ...props }, forwardedRef) => {
		return (
			<figure
				data-type="quote"
				ref={forwardedRef}
				className={cx("ui--quote", className)}
				{...props}
			>
				{children}
			</figure>
		);
	}
);

const QuoteBody = React.forwardRef<HTMLQuoteElement, QuoteBodyProps>(
	({ children, className, ...props }, forwardedRef) => {
		return (
			<blockquote
				ref={forwardedRef}
				className={cx("ui--quote__body", className)}
				{...props}
			>
				{children}
			</blockquote>
		);
	}
);

const QuoteSource = React.forwardRef<HTMLElement, QuoteSourceProps>(
	({ children, className, ...props }, forwardedRef) => {
		return (
			<figcaption
				ref={forwardedRef}
				className={cx("ui--quote__source", className)}
				{...props}
			>
				{children}
			</figcaption>
		);
	}
);

const QuoteCite = React.forwardRef<HTMLElement, QuoteCiteProps>(
	({ children, className, ...props }, forwardedRef) => {
		return (
			<cite
				ref={forwardedRef}
				className={cx("ui--quote__cite", className)}
				{...props}
			>
				{children}
			</cite>
		);
	}
);

Quote.displayName = "Quote";
QuoteBody.displayName = "QuoteBody";
QuoteSource.displayName = "QuoteSource";
QuoteCite.displayName = "QuoteCite";

export interface QuoteProps extends React.ComponentPropsWithRef<"figure"> {}

export interface QuoteBodyProps
	extends React.ComponentPropsWithRef<"blockquote"> {}

export interface QuoteSourceProps
	extends React.ComponentPropsWithRef<"figcaption"> {}

export interface QuoteCiteProps extends React.ComponentPropsWithRef<"cite"> {}

export { Quote, QuoteBody, QuoteSource, QuoteCite };
