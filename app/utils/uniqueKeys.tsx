export function generateKey(pre : string | number){
    return `${ pre }_${ new Date().getTime() }`;
}