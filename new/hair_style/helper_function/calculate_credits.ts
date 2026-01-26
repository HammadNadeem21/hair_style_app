const TOKEN_RATIO = 400

export const calculateCredits = (tokens: number) => {
    return tokens / TOKEN_RATIO
}