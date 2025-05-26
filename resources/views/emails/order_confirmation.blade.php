<h1>Obrigado pela sua compra, {{ $order['payment']['email'] }}!</h1>
<p>Seu pedido foi confirmado. Aqui estão os detalhes:</p>

<ul>
    @foreach($order['cart'] as $item)
        <li>
            {{ $item['product']->name }} - Quantidade: {{ $item['quantity'] }} - Preço: R$ {{ $item['product']->price }}
        </li>
    @endforeach
</ul>

<p>Subtotal: <strong>R$ {{ $order['payment']['subtotal'] }}</strong></p>
<p>Descontos: <strong>R$ {{ $order['payment']['discount'] }}</strong></p>
<p>Frete: <strong>R$ {{ $order['payment']['shipping'] }}</strong></p>
<p>Total: <strong>R$ {{ $order['payment']['total'] }}</strong></p>