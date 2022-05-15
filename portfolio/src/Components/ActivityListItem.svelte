<script>
    export let title, dateInfo, description, listInfo;
</script>

<li>
    <h4>{title}</h4>
    <small class="date-info">{dateInfo}</small>
    <p class="detail-text">{description}</p>
    <ul>
        {#each listInfo as cur}
            <li class="detail-text">{cur.title}</li>
        {/each}
    </ul>
</li>

<style>
    h4 {margin:0; padding:0; font-size:1.3em;}
    p {font-size:1.2em;}
    .date-info {font-variant: small-caps;}
    .detail-text {font-weight:300;}
</style>