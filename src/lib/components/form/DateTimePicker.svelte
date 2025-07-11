<!-- src\lib\components\form\DateTimePicker.svelte -->
<script lang="ts">
    import { onMount } from 'svelte';
    //import { $bindable, $props } from 'svelte';
    
    type Mode = 'datetime' | 'date' | 'time';

    interface Props {
        value?: Date | null;
        mode?: Mode;
        label?: string;
        disabled?: boolean;
        required?: boolean;
        class?: string;
        minDate?: Date | null;
        maxDate?: Date | null;
    }

    let {
        value = $bindable<Date | null>(),
        mode = 'datetime',
        label = '',
        disabled = false,
        required = false,
        class: className = '',
        minDate = null,
        maxDate = null,
    }: Props = $props();

    let showCalendar = $state(false);

    let calendarDate = $state(value ?? new Date());
    let selectedDate = $state(value ?? null);
    let selectedTime = $state(value ? value.toTimeString().slice(0, 5) : '12:00');

    let currentMonth = $derived(() => calendarDate.getMonth());
    let currentYear = $derived(() => calendarDate.getFullYear());

    const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    function getDaysInMonth(year: number, month: number) {
        return new Date(year, month + 1, 0).getDate();
    }

    function isDateDisabled(year: number, month: number, day: number) {
        const date = new Date(year, month, day);
        if (minDate && date < minDate) return true;
        if (maxDate && date > maxDate) return true;
        return false;
    }

    function openCalendar() {
        if (!disabled) showCalendar = true;
    }

    function closeCalendar() {
        showCalendar = false;
    }

    function selectDate(day: number) {
        if (isDateDisabled(currentYear(), currentMonth(), day)) return;
        const date = new Date(currentYear(), currentMonth(), day);
        selectedDate = date;
        calendarDate = date;
        showCalendar = false;
        updateValue();
    }

    function selectTime(e: Event) {
        selectedTime = (e.target as HTMLInputElement).value;
        updateValue();
    }

    function prevMonth() {
        if (currentMonth() === 0) {
            calendarDate = new Date(currentYear() - 1, 11, calendarDate.getDate());
        } else {
            calendarDate = new Date(currentYear(), currentMonth() - 1, calendarDate.getDate());
        }
    }

    function nextMonth() {
        if (currentMonth() === 11) {
            calendarDate = new Date(currentYear() + 1, 0, calendarDate.getDate());
        } else {
            calendarDate = new Date(currentYear(), currentMonth() + 1, calendarDate.getDate());
        }
    }

    function prevYear() {
        calendarDate = new Date(currentYear() - 1, currentMonth(), calendarDate.getDate());
    }

    function nextYear() {
        calendarDate = new Date(currentYear() + 1, currentMonth(), calendarDate.getDate());
    }

    function updateValue() {
        if (mode === 'date') {
            value = selectedDate;
        } else if (mode === 'time') {
            const [h, m] = selectedTime.split(':');
            const now = new Date();
            now.setHours(Number(h), Number(m), 0, 0);
            value = now;
        } else if (mode === 'datetime') {
            if (selectedDate) {
                const [h, m] = selectedTime.split(':');
                const dt = new Date(selectedDate);
                dt.setHours(Number(h), Number(m), 0, 0);
                value = dt;
            }
        }
    }

    // Getters for local and UTC
    function getLocal() {
        return value ? value.toLocaleString() : '';
    }
    function getUTC() {
        return value ? value.toISOString() : '';
    }

    // Close calendar on outside click
    function handleClickOutside(event: MouseEvent) {
        if (!(event.target as HTMLElement).closest('.dtp-container')) {
            closeCalendar();
        }
    }
    onMount(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    });
</script>

<div class={`space-y-1 dtp-container ${className}`}>
    {#if label}
        <label for="dtp-date-input" class="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
            {label}
            {#if required}
                <span class="text-red-500 ml-1">*</span>
            {/if}
        </label>
    {/if}

    <div class="flex gap-2 items-center">
        {#if mode !== 'time'}
            <button
                id="dtp-date-input"
                type="button"
                class="border border-cyan-300 dark:border-cyan-700 bg-white dark:bg-gray-900 text-cyan-600 dark:text-cyan-300 rounded-lg px-4 py-2 font-medium transition hover:bg-cyan-50 dark:hover:bg-cyan-950 disabled:opacity-50"
                onclick={openCalendar}
                disabled={disabled}
            >
                {selectedDate
                    ? selectedDate.toLocaleDateString()
                    : 'Select date'}
            </button>
        {/if}
        {#if mode !== 'date'}
            <input
                type="time"
                class="border border-cyan-300 dark:border-cyan-700 rounded-lg px-4 py-2 font-medium bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition focus:ring-2 focus:ring-cyan-500 dark:focus:ring-cyan-400 disabled:opacity-50"
                bind:value={selectedTime}
                oninput={selectTime}
                disabled={disabled}
                required={required}
            />
        {/if}
    </div>

    {#if showCalendar}
        <div class="absolute z-10 mt-2 bg-white dark:bg-gray-900 border border-cyan-300 dark:border-cyan-700 rounded-lg shadow-lg p-4 w-80 dtp-calendar">
            <div class="flex justify-between items-center mb-2">
                <button type="button" class="px-2 py-1 rounded hover:bg-cyan-50 dark:hover:bg-cyan-950" onclick={prevYear}>&laquo;</button>
                <button type="button" class="px-2 py-1 rounded hover:bg-cyan-50 dark:hover:bg-cyan-950" onclick={prevMonth}>&lt;</button>
                <div class="font-semibold text-cyan-600 dark:text-cyan-300">
                    {calendarDate.toLocaleString('default', { month: 'long' })} {currentYear}
                </div>
                <button type="button" class="px-2 py-1 rounded hover:bg-cyan-50 dark:hover:bg-cyan-950" onclick={nextMonth}>&gt;</button>
                <button type="button" class="px-2 py-1 rounded hover:bg-cyan-50 dark:hover:bg-cyan-950" onclick={nextYear}>&raquo;</button>
            </div>
            <div class="grid grid-cols-7 gap-1 mb-1">
                {#each daysOfWeek as day}
                    <div class="text-xs text-gray-500 dark:text-gray-400 text-center">{day}</div>
                {/each}
            </div>
            <div class="grid grid-cols-7 gap-1">
                {#each Array(new Date(currentYear(), currentMonth(), 1).getDay()).fill(0) as _}
                    <div></div>
                {/each}
                {#each Array(getDaysInMonth(currentYear(), currentMonth())).fill(0).map((_, i) => i + 1) as day}
                    <button
                        type="button"
                        class={`w-8 h-8 rounded-full text-sm font-medium transition
                            ${selectedDate && selectedDate.getDate() === day && selectedDate.getMonth() === currentMonth() && selectedDate.getFullYear() === currentYear()
                                ? 'bg-cyan-600 text-white dark:bg-cyan-900 dark:text-white'
                                : isDateDisabled(currentYear(), currentMonth(), day)
                                    ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed opacity-50'
                                    : 'hover:bg-cyan-50 dark:hover:bg-cyan-950 text-gray-900 dark:text-gray-100'}
                        `}
                        onclick={() => selectDate(day)}
                        disabled={isDateDisabled(currentYear(), currentMonth(), day)}
                    >
                        {day}
                    </button>
                {/each}
            </div>
        </div>
    {/if}

    <!-- Value display and UTC/local getters -->
    {#if value}
        <div class="flex gap-2 text-xs mt-2">
            <span class="text-gray-500 dark:text-gray-400">Local: <span class="font-medium">{getLocal()}</span></span>
            <span class="text-gray-500 dark:text-gray-400">UTC: <span class="font-medium">{getUTC()}</span></span>
        </div>
    {/if}
</div>

<style>
    .dtp-container { position: relative; }
    .dtp-calendar { position: absolute; left: 0; top: 100%; }
</style>