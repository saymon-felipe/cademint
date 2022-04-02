<template>
    <section class="maintenance">
        <div class="maintenance-container">
            <div class="maintenance-cog-animation">
                <i class="fas fa-cog"></i>   
                <i class="fas fa-cog"></i>   
                <i class="fas fa-cog"></i>   
            </div>
            <div class="mainentance-text">
                <h1>Sistema em manutenção!</h1>
                <p>Faça login novamente em alguns instantes.</p>
            </div>
        </div>
    </section>    
</template>
<script>
import { globalMethods } from '../js/globalMethods';

export default {
    name: "maintenancePage",
    mixins: [globalMethods],
    mounted() {
        this.checkIfUserIsAuthenticated();
    }
}
</script>
<style scoped>
.maintenance {
    width: 100vw;
    height: 100vh;
    background: var(--yellow);
    display: flex;
    align-items: center;
    justify-content: center;
}

.maintenance-container {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    width: 95vw;
    max-width: 850px;
    height: 70vh;
    max-height: 700px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: white;
    border-radius: 10px;
    z-index: 2;
    padding: 1rem;
}

.maintenance-cog-animation {
    display: flex;
    flex-direction: column;
    position: relative;
}

.maintenance-cog-animation i:nth-child(1) {
    margin-bottom: 1rem;
}

.maintenance-cog-animation i:nth-child(3) {
    margin-top: 1rem;
}

.maintenance-cog-animation i:nth-child(1), .maintenance-cog-animation i:nth-child(3) {
    font-size: 3rem;
    animation: rotateCog 3s linear infinite;
}

.maintenance-cog-animation i:nth-child(2) {
    color: var(--blue);
    font-size: 5rem;
    position: absolute;
    left: 2.5rem;
    top: 0;
    bottom: 0;
    margin: auto;
    height: 80px;
    animation: rotateCog 3s linear infinite reverse;
}

@keyframes rotateCog {
    0% {
        transform: rotate(0);
    }

    100% {
        transform: rotate(360deg);
    }
}

.mainentance-text {
    margin-left: 6.5rem;
}

    .mainentance-text h1 {
        color: var(--red);
        font-size: 2.5rem;
        margin-bottom: .5rem;
    }

    .mainentance-text p {
        font-weight: 700;
        font-size: 1.3rem;
    }

@media (max-width: 702px) {
    .maintenance-container {
        flex-direction: column;
    }

    .mainentance-text {
        margin: 0;
        text-align: center;
    }

    .maintenance-cog-animation {
        margin-left: -80px;
        margin-bottom: 3rem;
    }
}

@media (max-width: 605px) {
    .mainentance-text h1 {
        font-size: 2rem;
    }

    .mainentance-text p {
        font-weight: 700;
        font-size: 1rem;
    }

    .maintenance-cog-animation i:nth-child(1), .maintenance-cog-animation i:nth-child(3) {
        font-size: 2.5rem;
    }

    .maintenance-cog-animation i:nth-child(2) {
        font-size: 4.5rem;
        width: 72px;
        height: 72px;
    }
}
</style>