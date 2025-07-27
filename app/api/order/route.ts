

export const GET = async () => {

    const fetchOrders = await fetch('http://localhost:3000/api/order/')

    if (!fetchOrders) {
        return new Response(JSON.stringify({ error: 'Failed to fetch orders' }), { status: 500 })
    }

    const orders = await fetchOrders.json()

    return new Response(JSON.stringify(orders), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
    })
}