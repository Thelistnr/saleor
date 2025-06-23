"use client";

import { ApolloClient, ApolloProvider, createHttpLink, InMemoryCache } from "@apollo/client";
import { createSaleorAuthClient } from "@saleor/auth-sdk";
import { SaleorAuthProvider, useAuthChange } from "@saleor/auth-sdk/react";

const saleorApiUrl = process.env.NEXT_PUBLIC_SALEOR_API_URL;

const saleorAuthClient = createSaleorAuthClient({ saleorApiUrl });

// Apollo Client
const httpLink = createHttpLink({
	uri: saleorApiUrl,
	fetch: saleorAuthClient.fetchWithAuth,
});

export const apolloClient = new ApolloClient({
	link: httpLink,
	cache: new InMemoryCache(),
});
export function AuthProvider({ children }: { children: React.ReactNode }) {
	useAuthChange({
		saleorApiUrl,
		onSignedOut: () => apolloClient.resetStore(),
		onSignedIn: () => apolloClient.refetchQueries({ include: "all" }),
	});

	return (
		<SaleorAuthProvider client={saleorAuthClient}>
			<ApolloProvider client={apolloClient}>{children}</ApolloProvider>
		</SaleorAuthProvider>
	);
}
