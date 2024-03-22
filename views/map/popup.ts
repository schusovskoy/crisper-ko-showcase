export var popup = `
<div>
    <a class="map__popup-cover" data-bind="style: { 'background-image': 'url('+ (files[0] ? files[0].path +'/m' : '/resources/images/default') + '.jpg)' }, attr: { href: ($parents[1].page == 'OBJECTS_LIST' ? '/find/' : $parents[1].page == 'FAVORITES' ? '/favorites/' : '/find/my/') + id }"></a>
    <div class="map__popup-info">
        <p>
            <span data-bind="text: address"></span>
            <span class="icon address"></span>
        </p>
        <p>
            <span data-bind="cost: cost + (operation == 'RENT' ? ' рублей/месяц' :' рублей')"></span>
            <span class="icon cost"></span>
        </p>
        <p>
            <span data-bind="text: fio"></span>
            <span class="icon fio"></span>
        </p>
        <p>
            <span data-bind="phone: phone"></span>
            <span class="icon phone"></span>
        </p>
    </div>
    <div class="map__popup-additional">
        <p data-bind="text: sqmain + ' м²'"></p>
        <p data-bind="text: object == 'APARTMENT' ? 'Квартира' : object == 'HOUSE' ? 'Дом' : object == 'PARCEL' ? 'Участок' : 'Нежилое'"></p>
        <p data-bind="text: operation == 'RENT' ? 'Аренда' : 'Продажа'"></p>
    </div>
</div>
`;