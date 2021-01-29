export function authorize (root) {
    if (!root.user) {
        throw new Error('unauthorized');
    }
}
